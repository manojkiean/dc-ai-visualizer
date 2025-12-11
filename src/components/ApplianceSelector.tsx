import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Check } from "lucide-react";

const appliancesByRoom: Record<string, { id: string; name: string; description: string }[]> = {
  kitchen: [
    { id: "smart-fridge", name: "Smart Refrigerator", description: "Modern stainless steel" },
    { id: "induction-cooktop", name: "Induction Cooktop", description: "Sleek glass surface" },
    { id: "dishwasher", name: "Built-in Dishwasher", description: "Quiet operation" },
    { id: "microwave", name: "Built-in Microwave", description: "Integrated design" },
    { id: "coffee-machine", name: "Coffee Machine", description: "Professional grade" },
    { id: "range-hood", name: "Range Hood", description: "Powerful extraction" },
    { id: "wine-cooler", name: "Wine Cooler", description: "Temperature controlled" },
    { id: "smart-oven", name: "Smart Oven", description: "WiFi connected" },
  ],
  bedroom: [
    { id: "smart-tv", name: "Smart TV", description: "Wall-mounted display" },
    { id: "air-purifier", name: "Air Purifier", description: "HEPA filtration" },
    { id: "smart-lighting", name: "Smart Lighting", description: "Ambient controls" },
    { id: "humidifier", name: "Humidifier", description: "Ultrasonic mist" },
    { id: "smart-blinds", name: "Smart Blinds", description: "Motorized control" },
    { id: "bedside-charger", name: "Wireless Charger", description: "Nightstand integrated" },
  ],
  "living-room": [
    { id: "large-tv", name: "Large Screen TV", description: "4K OLED display" },
    { id: "soundbar", name: "Soundbar System", description: "Dolby Atmos" },
    { id: "smart-speaker", name: "Smart Speaker", description: "Voice assistant" },
    { id: "fireplace", name: "Electric Fireplace", description: "Ambient heating" },
    { id: "robot-vacuum", name: "Robot Vacuum", description: "Auto cleaning" },
    { id: "air-conditioner", name: "Split AC Unit", description: "Silent cooling" },
    { id: "gaming-console", name: "Gaming Setup", description: "Entertainment center" },
  ],
  bathroom: [
    { id: "smart-mirror", name: "Smart Mirror", description: "LED illuminated" },
    { id: "heated-floor", name: "Heated Floor", description: "Radiant warmth" },
    { id: "smart-toilet", name: "Smart Toilet", description: "Bidet integrated" },
    { id: "towel-warmer", name: "Towel Warmer", description: "Electric heated" },
    { id: "exhaust-fan", name: "Exhaust Fan", description: "Humidity control" },
    { id: "water-heater", name: "Tankless Heater", description: "Instant hot water" },
  ],
  office: [
    { id: "standing-desk", name: "Standing Desk", description: "Motorized height" },
    { id: "monitor-setup", name: "Multi-Monitor", description: "Ultrawide displays" },
    { id: "desk-lamp", name: "Smart Desk Lamp", description: "Eye-care lighting" },
    { id: "air-purifier-office", name: "Air Purifier", description: "Desktop size" },
    { id: "printer", name: "All-in-One Printer", description: "Wireless printing" },
    { id: "webcam", name: "HD Webcam", description: "Video conferencing" },
  ],
  outdoor: [
    { id: "grill", name: "Smart Grill", description: "WiFi temperature" },
    { id: "outdoor-speakers", name: "Outdoor Speakers", description: "Weather resistant" },
    { id: "patio-heater", name: "Patio Heater", description: "Infrared warmth" },
    { id: "outdoor-lighting", name: "Garden Lights", description: "Solar powered" },
    { id: "pool-equipment", name: "Pool Equipment", description: "Auto cleaning" },
    { id: "irrigation", name: "Smart Irrigation", description: "Auto watering" },
  ],
};

interface ApplianceSelectorProps {
  roomType: string;
  selectedAppliances: string[];
  onApplianceToggle: (applianceId: string) => void;
}

export const ApplianceSelector = ({ 
  roomType, 
  selectedAppliances, 
  onApplianceToggle 
}: ApplianceSelectorProps) => {
  const appliances = appliancesByRoom[roomType] || [];

  if (appliances.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Add Appliances & Features
        </h2>
        {selectedAppliances.length > 0 && (
          <Badge variant="secondary" className="text-sm">
            {selectedAppliances.length} selected
          </Badge>
        )}
      </div>
      <p className="text-muted-foreground mb-6">
        Select appliances to include in your redesigned room
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {appliances.map((appliance) => {
          const isSelected = selectedAppliances.includes(appliance.id);
          return (
            <Card
              key={appliance.id}
              onClick={() => onApplianceToggle(appliance.id)}
              className={`
                p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-elegant relative
                ${isSelected
                  ? "border-2 border-primary bg-primary/5 shadow-glow"
                  : "border border-border hover:border-primary/50"
                }
              `}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <h3 className="font-semibold text-sm mb-1">{appliance.name}</h3>
              <p className="text-xs text-muted-foreground">{appliance.description}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
