import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData, style } = await req.json();
    
    if (!imageData || !style) {
      return new Response(
        JSON.stringify({ error: "Missing imageData or style" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const styleDescriptions: Record<string, string> = {
      scandinavian: "Scandinavian style with clean lines, neutral colors, natural materials, minimalism, and cozy hygge elements",
      modern: "Modern contemporary style with sleek furniture, bold geometric shapes, neutral palette with accent colors",
      cozy: "Cozy warm style with soft textures, warm lighting, comfortable furniture, and inviting atmosphere",
      industrial: "Industrial style with exposed brick, metal accents, raw materials, and urban loft aesthetic",
      boho: "Bohemian style with eclectic patterns, plants, warm earth tones, and artistic decorative elements",
      luxury: "Luxury high-end style with premium materials, elegant furnishings, and sophisticated design",
      minimalist: "Minimalist style with clean spaces, essential furniture only, monochromatic colors, and clutter-free aesthetic",
      rustic: "Rustic farmhouse style with natural wood, vintage elements, warm colors, and country charm"
    };

    const stylePrompt = styleDescriptions[style] || style;
    const prompt = `Transform this interior room photo into a ${stylePrompt}. Keep the same room layout and perspective, but completely redesign the furniture, decor, colors, and styling to match the ${style} aesthetic. Make it look like a professional interior design rendering. Ultra high resolution, photorealistic.`;

    console.log("Generating redesigned image with style:", style);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              { type: "image_url", image_url: { url: imageData } }
            ]
          }
        ],
        modalities: ["image", "text"]
      }),
    });

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
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      console.error("No image in response:", JSON.stringify(data));
      throw new Error("No image generated");
    }

    return new Response(
      JSON.stringify({ generatedImage: generatedImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in redesign-image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
