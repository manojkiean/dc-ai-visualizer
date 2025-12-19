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
    const { imageData } = await req.json();
    
    if (!imageData) {
      return new Response(
        JSON.stringify({ error: "Missing imageData" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Detecting room type from image...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: `Analyze this room image and identify the room type. Respond with ONLY a JSON object in this exact format:
{
  "roomType": "kitchen" | "bedroom" | "living-room" | "bathroom" | "office" | "exterior" | "garden" | "other",
  "confidence": 0.0 to 1.0,
  "description": "brief description of what you see"
}

Only use these exact room type values: 
- kitchen (indoor cooking area)
- bedroom (sleeping area)
- living-room (lounge/sitting area)
- bathroom (bathing area)
- office (workspace)
- exterior (building exterior, garage, patio, balcony, driveway, fence, porch)
- garden (outdoor green spaces, landscaping, lawn, pool area, backyard with plants)
- other (if it doesn't fit any category)`
              },
              { type: "image_url", image_url: { url: imageData } }
            ]
          }
        ],
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
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    console.log("Room detection response:", content);

    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse room detection response");
    }

    const roomData = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify(roomData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in detect-room:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to detect room";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
