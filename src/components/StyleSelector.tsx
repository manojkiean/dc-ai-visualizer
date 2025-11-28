import { Card } from "./ui/card";

const styles = [
  { id: "scandinavian", name: "Scandinavian", description: "Minimalist, light, natural materials" },
  { id: "modern", name: "Modern", description: "Clean lines, sleek, contemporary" },
  { id: "cozy", name: "Cozy", description: "Warm, comfortable, inviting" },
  { id: "industrial", name: "Industrial", description: "Raw, exposed, urban aesthetic" },
  { id: "boho", name: "Boho", description: "Eclectic, vibrant, artistic" },
  { id: "minimalist", name: "Minimalist", description: "Simple, uncluttered, essential" },
  { id: "rustic", name: "Rustic", description: "Natural, weathered, countryside charm" },
  { id: "luxury", name: "Luxury", description: "Elegant, refined, high-end finishes" },
];

interface StyleSelectorProps {
  selectedStyle: string | null;
  onStyleSelect: (styleId: string) => void;
}

export const StyleSelector = ({ selectedStyle, onStyleSelect }: StyleSelectorProps) => {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        Choose Your Style
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {styles.map((style) => (
          <Card
            key={style.id}
            onClick={() => onStyleSelect(style.id)}
            className={`
              p-6 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-elegant
              ${selectedStyle === style.id
                ? "border-2 border-primary bg-primary/5 shadow-glow"
                : "border border-border hover:border-primary/50"
              }
            `}
          >
            <h3 className="font-semibold text-lg mb-2">{style.name}</h3>
            <p className="text-sm text-muted-foreground">{style.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
