import { Card } from "./ui/card";
import { 
  UtensilsCrossed, 
  Bed, 
  Sofa, 
  Bath, 
  Briefcase,
  TreeDeciduous
} from "lucide-react";

const roomTypes = [
  { id: "kitchen", name: "Kitchen", icon: UtensilsCrossed },
  { id: "bedroom", name: "Bedroom", icon: Bed },
  { id: "living-room", name: "Living Room", icon: Sofa },
  { id: "bathroom", name: "Bathroom", icon: Bath },
  { id: "office", name: "Office", icon: Briefcase },
  { id: "outdoor", name: "Outdoor/Garden", icon: TreeDeciduous },
];

interface RoomTypeSelectorProps {
  selectedRoom: string | null;
  onRoomSelect: (roomId: string) => void;
}

export const RoomTypeSelector = ({ selectedRoom, onRoomSelect }: RoomTypeSelectorProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Select Room Type
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {roomTypes.map((room) => {
          const Icon = room.icon;
          return (
            <Card
              key={room.id}
              onClick={() => onRoomSelect(room.id)}
              className={`
                p-4 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-elegant
                flex flex-col items-center justify-center gap-3 min-h-[100px]
                ${selectedRoom === room.id
                  ? "border-2 border-primary bg-primary/5 shadow-glow"
                  : "border border-border hover:border-primary/50"
                }
              `}
            >
              <Icon className={`w-8 h-8 ${selectedRoom === room.id ? "text-primary" : "text-muted-foreground"}`} />
              <span className="font-medium text-sm text-center">{room.name}</span>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
