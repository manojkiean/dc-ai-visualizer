import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, imageBase64, mimeType } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Sending image redesign request to Lovable AI gateway...");

    const response = await fetch(
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
                {
                  type: "text",
                  text: prompt,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${mimeType};base64,${imageBase64}`,
                  },
                },
              ],
            },
          ],
          modalities: ["image", "text"],
        }),
      }
    );

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

    const data = await response.json();
    console.log("Full AI gateway response structure:", JSON.stringify(Object.keys(data)));
    
    const message = data.choices?.[0]?.message;
    console.log("Message keys:", message ? JSON.stringify(Object.keys(message)) : "no message");
    console.log("Message content type:", typeof message?.content);
    console.log("Message images:", message?.images ? JSON.stringify(message.images.length) : "no images field");

    // Try images array first (documented format)
    let imageUrl = message?.images?.[0]?.image_url?.url;

    // Fallback: check if content contains base64 image data
    if (!imageUrl && message?.content) {
      // Some responses may embed image data differently
      if (typeof message.content === "string" && message.content.startsWith("data:image")) {
        imageUrl = message.content;
      }
      // Check if content is an array with image parts
      if (Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "image_url" && part.image_url?.url) {
            imageUrl = part.image_url.url;
            break;
          }
          if (part.type === "image" && part.image?.url) {
            imageUrl = part.image.url;
            break;
          }
        }
      }
    }

    const textContent = typeof message?.content === "string" ? message.content : "";

    if (!imageUrl) {
      console.error("Full response data:", JSON.stringify(data).substring(0, 2000));
      throw new Error("No image was generated. The AI model may not have produced an image for this request. Please try again.");
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
