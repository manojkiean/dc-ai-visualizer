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
    const { imageData, style, roomType, appliances } = await req.json();
    
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

    const applianceDescriptions: Record<string, string> = {
      "smart-fridge": "modern stainless steel smart refrigerator",
      "induction-cooktop": "sleek glass induction cooktop",
      "dishwasher": "built-in dishwasher",
      "microwave": "built-in microwave oven",
      "coffee-machine": "professional-grade coffee machine",
      "range-hood": "modern range hood",
      "wine-cooler": "wine cooler cabinet",
      "smart-oven": "smart connected oven",
      "smart-tv": "wall-mounted smart TV",
      "air-purifier": "modern air purifier",
      "smart-lighting": "smart ambient lighting system",
      "humidifier": "sleek ultrasonic humidifier",
      "smart-blinds": "motorized smart blinds",
      "bedside-charger": "wireless charging nightstand",
      "large-tv": "large 4K OLED TV",
      "soundbar": "premium soundbar system",
      "smart-speaker": "smart speaker device",
      "fireplace": "modern electric fireplace",
      "robot-vacuum": "robot vacuum cleaner",
      "air-conditioner": "wall-mounted split AC unit",
      "gaming-console": "gaming entertainment setup",
      "smart-mirror": "LED-lit smart mirror",
      "heated-floor": "heated floor system",
      "smart-toilet": "modern smart toilet with bidet",
      "towel-warmer": "heated towel rack",
      "exhaust-fan": "modern exhaust fan",
      "water-heater": "tankless water heater",
      "standing-desk": "motorized standing desk",
      "monitor-setup": "multi-monitor workstation",
      "desk-lamp": "smart LED desk lamp",
      "air-purifier-office": "compact air purifier",
      "printer": "all-in-one printer",
      "webcam": "HD webcam setup",
      "grill": "outdoor smart grill",
      "outdoor-speakers": "weather-resistant outdoor speakers",
      "patio-heater": "infrared patio heater",
      "outdoor-lighting": "solar-powered garden lights",
      "pool-equipment": "pool cleaning equipment",
      "irrigation": "smart irrigation system"
    };

    const stylePrompt = styleDescriptions[style] || style;
    
    let appliancePrompt = "";
    if (appliances && appliances.length > 0) {
      const applianceList = appliances
        .map((id: string) => applianceDescriptions[id] || id.replace(/-/g, " "))
        .join(", ");
      appliancePrompt = ` Include these appliances/features in the design: ${applianceList}.`;
    }

    let roomPrompt = "";
    if (roomType) {
      roomPrompt = ` This is a ${roomType.replace(/-/g, " ")} space.`;
    }

    const prompt = `Transform this interior room photo into a ${stylePrompt}.${roomPrompt}${appliancePrompt} Keep the same room layout and perspective, but completely redesign the furniture, decor, colors, and styling to match the ${style} aesthetic. Make it look like a professional interior design rendering. Ultra high resolution, photorealistic.`;

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
