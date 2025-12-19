import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  UtensilsCrossed, 
  Bed, 
  Sofa, 
  Bath, 
  Briefcase,
  Building2,
  TreeDeciduous,
  HelpCircle,
  Loader2,
  Check
} from "lucide-react";

const roomTypes = [
  { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
  { id: "bedroom", name: "Bedroom", icon: Bed },
  { id: "living-room", name: "Living Room", icon: Sofa },
  { id: "bathroom", name: "Bathroom", icon: Bath },
  { id: "office", name: "Office", icon: Briefcase },
  { id: "exterior", name: "Exterior", icon: Building2 },
  { id: "garden", name: "Garden", icon: TreeDeciduous },
  { id: "other", name: "Other", icon: HelpCircle },
];

interface RoomTypeSelectorProps {
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
  detectedRoom?: string | null;
  isDetecting?: boolean;
  customRoomName?: string;
  onCustomRoomChange?: (name: string) => void;
}

export const RoomTypeSelector = ({ 
  selectedRoom, 
  onRoomSelect,
  detectedRoom,
  isDetecting,
  customRoomName = "",
  onCustomRoomChange
}: RoomTypeSelectorProps) => {
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleRoomClick = (roomId: string) => {
    if (roomId === "other") {
      setShowCustomInput(true);
      onRoomSelect("other");
    } else {
      setShowCustomInput(false);
      onRoomSelect(roomId);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Room Type
        </h2>
        {isDetecting && (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            Detecting...
          </Badge>
        )}
        {detectedRoom && !isDetecting && (
          <Badge variant="default" className="gap-1">
            <Check className="w-3 h-3" />
            Auto-detected
          </Badge>
        )}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {roomTypes.map((room) => {
          const Icon = room.icon;
          const isSelected = selectedRoom === room.id;
          const isDetected = detectedRoom === room.id && !isSelected;
          
          return (
            <Card
              key={room.id}
              onClick={() => handleRoomClick(room.id)}
              className={`
                p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-elegant
                flex flex-col items-center justify-center gap-3 min-h-[100px]
                ${isSelected
                  ? "border-2 border-primary bg-primary/5 shadow-glow"
                  : isDetected
                    ? "border-2 border-accent/50 bg-accent/5"
                    : "border border-border hover:border-primary/50"
                }
              `}
            >
              <Icon className={`w-8 h-8 ${isSelected ? "text-primary" : isDetected ? "text-accent" : "text-muted-foreground"}`} />
              <span className="font-medium text-sm text-center">{room.name}</span>
              {isDetected && (
                <Badge variant="outline" className="text-xs">Detected</Badge>
              )}
            </Card>
          );
        })}
      </div>

      {(showCustomInput || selectedRoom === "other") && (
        <div className="mt-4 max-w-md">
          <Input
            placeholder="Enter room type (e.g., Garage, Basement, Nursery...)"
            value={customRoomName}
            onChange={(e) => onCustomRoomChange?.(e.target.value)}
            className="w-full"
          />
          <p className="text-sm text-muted-foreground mt-2">
            Describe the type of room for better redesign results
          </p>
        </div>
      )}
    </div>
  );
};
