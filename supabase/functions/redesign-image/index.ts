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
    const { imageData, style, apiKey } = await req.json();

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Missing API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate style against allowed values
    const allowedStyles = ["scandinavian", "modern", "cozy", "industrial", "boho", "luxury"];
    if (!style || !allowedStyles.includes(style.toLowerCase())) {
      return new Response(
        JSON.stringify({ error: `Invalid style. Must be one of: ${allowedStyles.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate imageData format and size
    if (!imageData || typeof imageData !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid imageData format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!imageData.startsWith("data:image/")) {
      return new Response(
        JSON.stringify({ error: "Invalid image format. Must be a data URL" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check size (10MB limit for base64 - base64 is ~37% larger than binary)
    if (imageData.length > 10 * 1024 * 1024 * 1.37) {
      return new Response(
        JSON.stringify({ error: "Image too large. Maximum 10MB" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Redesigning image with style:", style);

    // Extract base64 data from data URL
    const base64Data = imageData.split(",")[1];

    const prompt = `Transform this interior design image into a ${style} style. Maintain the room layout and structure but completely redesign the furniture, colors, textures, and decorative elements to match the ${style} aesthetic. Make it photorealistic and professionally designed.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            response_modalities: ["image"],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate image" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const generatedImageData = data.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;

    if (!generatedImageData) {
      throw new Error("No image generated");
    }

    // Convert base64 to data URL
    const generatedImageUrl = `data:image/jpeg;base64,${generatedImageData}`;

    return new Response(
      JSON.stringify({ generatedImage: generatedImageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in redesign-image function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
