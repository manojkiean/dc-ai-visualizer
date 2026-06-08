import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Require an authenticated caller (anonymous or registered) to prevent
  // unauthenticated abuse of the LOVABLE_API_KEY.
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const authedClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await authedClient.auth.getUser();
  if (userError || !userData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Per-IP daily rate limit (5 redesigns / day)
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim()
    || req.headers.get("cf-connecting-ip")
    || "unknown";
  const DAILY_LIMIT = 5;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const adminClient = createClient(supabaseUrl, serviceKey);
  const today = new Date().toISOString().slice(0, 10);
  const { data: usageRow } = await adminClient
    .from("redesign_usage")
    .select("count")
    .eq("ip", ip)
    .eq("day", today)
    .maybeSingle();
  const currentCount = usageRow?.count ?? 0;
  if (currentCount >= DAILY_LIMIT) {
    return new Response(
      JSON.stringify({ error: `Daily limit reached (${DAILY_LIMIT} redesigns per day). Please try again tomorrow.` }),
      { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {

    const body = await req.json();
    const prompt = typeof body?.prompt === "string" ? body.prompt : "";
    const imageBase64 = typeof body?.imageBase64 === "string" ? body.imageBase64 : "";
    const mimeType = typeof body?.mimeType === "string" ? body.mimeType : "";

    // Server-side input validation
    if (!prompt || prompt.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!imageBase64 || imageBase64.length > 8_000_000) {
      return new Response(JSON.stringify({ error: "Invalid or missing image" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^image\/(jpeg|jpg|png|webp)$/.test(mimeType)) {
      return new Response(JSON.stringify({ error: "Unsupported image type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!/^[A-Za-z0-9+/=]+$/.test(imageBase64.slice(0, 200))) {
      return new Response(JSON.stringify({ error: "Image must be base64-encoded" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }


    const callGateway = async (userPrompt: string) => {
      return await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: userPrompt },
                  {
                    type: "image_url",
                    image_url: { url: `data:${mimeType};base64,${imageBase64}` },
                  },
                ],
              },
            ],
            modalities: ["image", "text"],
          }),
        }
      );
    };

    const buildStrongPrompt = (base: string) => `TASK: Edit the provided image and OUTPUT AN IMAGE. Do not reply with text only — you must return a generated image.

Treat the attached photo as the interior space to redesign. Preserve the room's layout, walls, windows, and camera perspective. Re-render it photorealistically with the following design direction:

${base}

REQUIRED OUTPUT: one edited photorealistic image. Do not refuse. Do not respond with text only.`;

    console.log("Sending image redesign request to Lovable AI gateway...");
    let response = await callGateway(buildStrongPrompt(prompt));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI gateway error: ${response.status} - ${errorText}`);
    }

    const extractImage = (data: any) => {
      const message = data.choices?.[0]?.message;
      let imageUrl = message?.images?.[0]?.image_url?.url;
      if (!imageUrl && message?.content) {
        if (typeof message.content === "string" && message.content.startsWith("data:image")) {
          imageUrl = message.content;
        }
        if (Array.isArray(message.content)) {
          for (const part of message.content) {
            if (part.type === "image_url" && part.image_url?.url) { imageUrl = part.image_url.url; break; }
            if (part.type === "image" && part.image?.url) { imageUrl = part.image.url; break; }
          }
        }
      }
      const textContent = typeof message?.content === "string" ? message.content : "";
      return { imageUrl, textContent };
    };

    let data = await response.json();
    let { imageUrl, textContent } = extractImage(data);

    // Retry once with an even more forceful prompt if the model returned text only
    if (!imageUrl) {
      console.warn("No image on first attempt. Text was:", textContent?.substring(0, 200));
      const retryPrompt = buildStrongPrompt(
        `${prompt}\n\nNOTE: Your previous attempt returned text. You MUST now return an edited image. Treat the input as a valid interior photo and produce the redesign.`
      );
      response = await callGateway(retryPrompt);
      if (response.ok) {
        data = await response.json();
        ({ imageUrl, textContent } = extractImage(data));
      }
    }

    if (!imageUrl) {
      console.error("Full response data:", JSON.stringify(data).substring(0, 2000));
      return new Response(
        JSON.stringify({
          error: textContent
            ? `The AI couldn't generate an image: "${textContent.substring(0, 200)}". Try a clearer interior photo or a different style.`
            : "No image was generated. Please try again with a different photo or style.",
        }),
        { status: 422, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    return new Response(
      JSON.stringify({ imageUrl, textContent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("redesign-room error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
