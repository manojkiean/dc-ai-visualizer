import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, ShoppingBag } from "lucide-react";

// TODO: Replace with your Amazon Associates tag
const AMAZON_AFFILIATE_TAG = "dialchimpuk0f-21";

type Product = {
  title: string;
  keyword: string; // Amazon search keyword
  price?: string;
};

// Map appliance IDs -> recommended Amazon products
const productsByAppliance: Record<string, Product[]> = {
  "smart-fridge": [
    { title: "Samsung Smart Refrigerator", keyword: "samsung+smart+refrigerator", price: "$1,899" },
    { title: "LG InstaView Fridge", keyword: "lg+instaview+refrigerator", price: "$2,299" },
  ],
  "induction-cooktop": [
    { title: "Bosch 30\" Induction Cooktop", keyword: "bosch+induction+cooktop+30", price: "$1,499" },
    { title: "Frigidaire Induction Cooktop", keyword: "frigidaire+induction+cooktop", price: "$899" },
  ],
  "coffee-machine": [
    { title: "Breville Barista Express", keyword: "breville+barista+express", price: "$699" },
    { title: "De'Longhi La Specialista", keyword: "delonghi+la+specialista", price: "$799" },
  ],
  "smart-tv": [
    { title: "Samsung 55\" QLED TV", keyword: "samsung+qled+55+tv", price: "$899" },
    { title: "LG OLED C3 55\"", keyword: "lg+oled+c3+55", price: "$1,299" },
  ],
  "large-tv": [
    { title: "Sony Bravia 75\" OLED", keyword: "sony+bravia+75+oled", price: "$2,499" },
    { title: "LG 77\" OLED evo", keyword: "lg+77+oled+evo", price: "$2,799" },
  ],
  "soundbar": [
    { title: "Sonos Arc Dolby Atmos", keyword: "sonos+arc+soundbar", price: "$899" },
    { title: "Samsung HW-Q990C", keyword: "samsung+hw+q990c+soundbar", price: "$1,499" },
  ],
  "smart-speaker": [
    { title: "Amazon Echo Studio", keyword: "amazon+echo+studio", price: "$199" },
    { title: "Sonos Era 300", keyword: "sonos+era+300", price: "$449" },
  ],
  "robot-vacuum": [
    { title: "iRobot Roomba j7+", keyword: "irobot+roomba+j7+plus", price: "$599" },
    { title: "Roborock S8 Pro Ultra", keyword: "roborock+s8+pro+ultra", price: "$1,399" },
  ],
  "air-purifier": [
    { title: "Dyson HP07 Purifier", keyword: "dyson+hp07+air+purifier", price: "$649" },
    { title: "Coway Airmega 400", keyword: "coway+airmega+400", price: "$449" },
  ],
  "smart-lighting": [
    { title: "Philips Hue Starter Kit", keyword: "philips+hue+starter+kit", price: "$199" },
    { title: "LIFX Color A19 Bulbs", keyword: "lifx+color+a19", price: "$129" },
  ],
  "smart-mirror": [
    { title: "LED Smart Bathroom Mirror", keyword: "led+smart+bathroom+mirror", price: "$249" },
  ],
  "standing-desk": [
    { title: "Uplift V2 Standing Desk", keyword: "uplift+v2+standing+desk", price: "$699" },
    { title: "Flexispot E7 Pro", keyword: "flexispot+e7+pro+standing+desk", price: "$499" },
  ],
  "monitor-setup": [
    { title: "LG 34\" Ultrawide Monitor", keyword: "lg+34+ultrawide+monitor", price: "$499" },
    { title: "Dell U3423WE Ultrawide", keyword: "dell+u3423we+ultrawide", price: "$899" },
  ],
  "fire-pit": [
    { title: "Solo Stove Bonfire 2.0", keyword: "solo+stove+bonfire", price: "$299" },
    { title: "Outland Propane Fire Pit", keyword: "outland+propane+fire+pit", price: "$249" },
  ],
  "grill": [
    { title: "Weber Genesis II E-335", keyword: "weber+genesis+ii+e335", price: "$1,099" },
    { title: "Traeger Pro 575 WiFi", keyword: "traeger+pro+575", price: "$799" },
  ],
  "patio-furniture": [
    { title: "Outdoor Sectional Sofa Set", keyword: "outdoor+sectional+patio+furniture", price: "$899" },
  ],
  "patio-heater": [
    { title: "Hiland Pyramid Patio Heater", keyword: "hiland+pyramid+patio+heater", price: "$349" },
  ],
  "garden-lighting": [
    { title: "Solar Pathway Lights (12 Pack)", keyword: "solar+pathway+lights", price: "$45" },
  ],
  "irrigation": [
    { title: "Rachio 3 Smart Sprinkler", keyword: "rachio+3+smart+sprinkler", price: "$229" },
  ],
  "hot-tub": [
    { title: "Intex PureSpa Inflatable Hot Tub", keyword: "intex+purespa+hot+tub", price: "$699" },
  ],
};

// Fallback generic recs by room type for when no appliance matches
const fallbackByRoom: Record<string, Product[]> = {
  kitchen: [{ title: "Modern Kitchen Decor Set", keyword: "modern+kitchen+decor" }],
  bedroom: [{ title: "Luxury Bedding Set", keyword: "luxury+bedding+set" }],
  "living-room": [{ title: "Modern Throw Pillows", keyword: "modern+throw+pillows" }],
  bathroom: [{ title: "Spa Bathroom Accessories", keyword: "spa+bathroom+accessories" }],
  office: [{ title: "Ergonomic Office Chair", keyword: "ergonomic+office+chair" }],
  garden: [{ title: "Garden Decor Set", keyword: "garden+decor" }],
  exterior: [{ title: "Outdoor Wall Lights", keyword: "outdoor+wall+lights" }],
};

const buildAmazonUrl = (keyword: string) =>
  `https://www.amazon.co.uk/s?k=${keyword}&tag=${AMAZON_AFFILIATE_TAG}`;

interface AffiliateProductsProps {
  selectedAppliances: string[];
  roomType: string | null;
}

export const AffiliateProducts = ({ selectedAppliances, roomType }: AffiliateProductsProps) => {
  const recs: { applianceId: string; products: Product[] }[] = [];

  selectedAppliances.forEach((id) => {
    const products = productsByAppliance[id];
    if (products?.length) recs.push({ applianceId: id, products });
  });

  if (recs.length === 0 && roomType && fallbackByRoom[roomType]) {
    recs.push({ applianceId: roomType, products: fallbackByRoom[roomType] });
  }

  if (recs.length === 0) return null;

  return (
    <aside className="w-full">
      <Card className="p-5 sticky top-4 bg-card/50 backdrop-blur border-primary/20">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h3 className="font-bold text-lg">Recommended Products</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Curated picks from Amazon based on your selections
        </p>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
          {recs.flatMap(({ products }) =>
            products.map((p) => (
              <div
                key={p.title}
                className="group border border-border rounded-lg p-3 hover:border-primary/50 hover:shadow-elegant transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm leading-tight">{p.title}</h4>
                  {p.price && (
                    <span className="text-xs font-bold text-primary whitespace-nowrap">
                      {p.price}
                    </span>
                  )}
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  <a
                    href={buildAmazonUrl(p.keyword)}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                  >
                    View on Amazon <ExternalLink className="w-3 h-3" />
                  </a>
                </Button>
              </div>
            ))
          )}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border">
          As an Amazon Associate we earn from qualifying purchases.
        </p>
      </Card>
    </aside>
  );
};
