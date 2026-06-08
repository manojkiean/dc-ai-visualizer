import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ExternalLink, ShoppingBag } from "lucide-react";

const AMAZON_AFFILIATE_TAG = "dialchimpuk0f-21";

type Product = {
  title: string;
  keyword: string;
  price: string;
  image: string;
};

// Helper to build an Unsplash image URL from a search term (free, no API key)
const img = (q: string) =>
  `https://source.unsplash.com/400x300/?${encodeURIComponent(q)}`;

const productsByAppliance: Record<string, Product[]> = {
  "smart-fridge": [
    { title: "Samsung Smart Refrigerator", keyword: "samsung+smart+refrigerator", price: "£1,499", image: img("samsung refrigerator") },
    { title: "LG InstaView Fridge", keyword: "lg+instaview+refrigerator", price: "£1,799", image: img("lg refrigerator") },
    { title: "Bosch Series 6 American Fridge", keyword: "bosch+american+fridge+freezer", price: "£1,299", image: img("modern fridge") },
    { title: "Hisense PureFlat Fridge Freezer", keyword: "hisense+pureflat+fridge", price: "£899", image: img("stainless fridge") },
    { title: "Beko Frost Free Fridge Freezer", keyword: "beko+frost+free+fridge", price: "£549", image: img("kitchen fridge") },
  ],
  "induction-cooktop": [
    { title: "Bosch 60cm Induction Hob", keyword: "bosch+induction+hob+60cm", price: "£499", image: img("induction hob") },
    { title: "AEG 80cm Induction Hob", keyword: "aeg+induction+hob+80cm", price: "£799", image: img("induction cooktop") },
    { title: "Neff 60cm FlexInduction", keyword: "neff+flexinduction+hob", price: "£899", image: img("induction stove") },
    { title: "Hotpoint 60cm Induction Hob", keyword: "hotpoint+induction+hob", price: "£299", image: img("kitchen cooktop") },
    { title: "Samsung 60cm Induction Hob", keyword: "samsung+induction+hob", price: "£449", image: img("modern hob") },
  ],
  "coffee-machine": [
    { title: "De'Longhi La Specialista", keyword: "delonghi+la+specialista", price: "£649", image: img("espresso machine") },
    { title: "Sage Barista Express", keyword: "sage+barista+express", price: "£599", image: img("coffee machine") },
    { title: "Nespresso Vertuo Plus", keyword: "nespresso+vertuo+plus", price: "£129", image: img("nespresso") },
    { title: "Jura E8 Bean to Cup", keyword: "jura+e8+bean+to+cup", price: "£1,199", image: img("bean to cup coffee") },
    { title: "Smeg Drip Filter Coffee", keyword: "smeg+drip+filter+coffee", price: "£199", image: img("filter coffee") },
  ],
  "smart-tv": [
    { title: "Samsung 55\" QLED Q60C", keyword: "samsung+qled+55+q60c", price: "£699", image: img("samsung tv") },
    { title: "LG OLED C3 55\"", keyword: "lg+oled+c3+55", price: "£999", image: img("oled tv") },
    { title: "Sony Bravia 55\" XR", keyword: "sony+bravia+55+xr", price: "£899", image: img("sony tv") },
    { title: "Hisense 55\" U7K Mini-LED", keyword: "hisense+u7k+55", price: "£599", image: img("hisense tv") },
    { title: "TCL 55\" 4K QLED", keyword: "tcl+55+qled+4k", price: "£449", image: img("4k tv") },
  ],
  "large-tv": [
    { title: "Sony Bravia 75\" OLED", keyword: "sony+bravia+75+oled", price: "£1,999", image: img("large oled tv") },
    { title: "LG 77\" OLED evo C3", keyword: "lg+77+oled+c3", price: "£2,299", image: img("lg oled 77") },
    { title: "Samsung 75\" Neo QLED", keyword: "samsung+75+neo+qled", price: "£1,799", image: img("neo qled tv") },
    { title: "Hisense 85\" U7K", keyword: "hisense+85+u7k", price: "£1,499", image: img("large tv living room") },
    { title: "TCL 85\" 4K QLED", keyword: "tcl+85+qled", price: "£1,199", image: img("home cinema tv") },
  ],
  "soundbar": [
    { title: "Sonos Arc Dolby Atmos", keyword: "sonos+arc+soundbar", price: "£799", image: img("sonos soundbar") },
    { title: "Samsung HW-Q990C", keyword: "samsung+hw+q990c+soundbar", price: "£1,299", image: img("samsung soundbar") },
    { title: "Bose Smart Soundbar 900", keyword: "bose+smart+soundbar+900", price: "£899", image: img("bose soundbar") },
    { title: "Sony HT-A7000", keyword: "sony+ht+a7000", price: "£999", image: img("sony soundbar") },
    { title: "JBL Bar 1000", keyword: "jbl+bar+1000", price: "£699", image: img("jbl soundbar") },
  ],
  "smart-speaker": [
    { title: "Amazon Echo Studio", keyword: "amazon+echo+studio", price: "£189", image: img("amazon echo") },
    { title: "Sonos Era 300", keyword: "sonos+era+300", price: "£449", image: img("sonos speaker") },
    { title: "Apple HomePod 2nd Gen", keyword: "apple+homepod+2nd+gen", price: "£299", image: img("apple homepod") },
    { title: "Google Nest Audio", keyword: "google+nest+audio", price: "£89", image: img("google nest") },
    { title: "Bose Home Speaker 500", keyword: "bose+home+speaker+500", price: "£399", image: img("bose speaker") },
  ],
  "robot-vacuum": [
    { title: "iRobot Roomba j7+", keyword: "irobot+roomba+j7+plus", price: "£599", image: img("robot vacuum") },
    { title: "Roborock S8 Pro Ultra", keyword: "roborock+s8+pro+ultra", price: "£1,199", image: img("roborock") },
    { title: "Eufy RoboVac X8 Pro", keyword: "eufy+robovac+x8+pro", price: "£449", image: img("eufy vacuum") },
    { title: "Dyson 360 Vis Nav", keyword: "dyson+360+vis+nav", price: "£999", image: img("dyson vacuum") },
    { title: "Shark AI Ultra Robot", keyword: "shark+ai+ultra+robot+vacuum", price: "£499", image: img("shark vacuum") },
  ],
  "air-purifier": [
    { title: "Dyson HP07 Purifier", keyword: "dyson+hp07+air+purifier", price: "£549", image: img("dyson purifier") },
    { title: "Coway Airmega 400", keyword: "coway+airmega+400", price: "£399", image: img("air purifier") },
    { title: "Philips 3000i Series", keyword: "philips+3000i+air+purifier", price: "£329", image: img("philips purifier") },
    { title: "Levoit Core 600S", keyword: "levoit+core+600s", price: "£249", image: img("home air purifier") },
    { title: "Blueair Blue Pure 211+", keyword: "blueair+blue+pure+211", price: "£299", image: img("blueair") },
  ],
  "smart-lighting": [
    { title: "Philips Hue Starter Kit", keyword: "philips+hue+starter+kit", price: "£169", image: img("philips hue") },
    { title: "LIFX Color A19 Bulbs", keyword: "lifx+color+a19", price: "£109", image: img("smart bulb") },
    { title: "Govee LED Strip Pro", keyword: "govee+led+strip+pro", price: "£59", image: img("led strip") },
    { title: "Nanoleaf Shapes Hexagons", keyword: "nanoleaf+shapes+hexagons", price: "£199", image: img("nanoleaf") },
    { title: "TP-Link Tapo Smart Bulbs", keyword: "tp+link+tapo+smart+bulb", price: "£29", image: img("smart lighting") },
  ],
  "smart-mirror": [
    { title: "LED Smart Bathroom Mirror", keyword: "led+smart+bathroom+mirror", price: "£199", image: img("smart mirror") },
    { title: "Anti-Fog LED Mirror 80cm", keyword: "anti+fog+led+mirror", price: "£149", image: img("bathroom mirror") },
    { title: "Bluetooth LED Mirror", keyword: "bluetooth+led+bathroom+mirror", price: "£229", image: img("led mirror") },
    { title: "Hollywood Vanity Mirror", keyword: "hollywood+vanity+mirror", price: "£99", image: img("vanity mirror") },
    { title: "Touch Sensor Round Mirror", keyword: "touch+sensor+round+led+mirror", price: "£129", image: img("round mirror") },
  ],
  "standing-desk": [
    { title: "Flexispot E7 Pro", keyword: "flexispot+e7+pro+standing+desk", price: "£429", image: img("standing desk") },
    { title: "Yo-Yo Desk Pro 2", keyword: "yo+yo+desk+pro+2", price: "£499", image: img("electric desk") },
    { title: "IKEA Bekant Sit/Stand", keyword: "ikea+bekant+sit+stand", price: "£499", image: img("ikea desk") },
    { title: "Songmics Adjustable Desk", keyword: "songmics+standing+desk", price: "£249", image: img("adjustable desk") },
    { title: "Vivo Electric Standing Desk", keyword: "vivo+electric+standing+desk", price: "£349", image: img("home office desk") },
  ],
  "monitor-setup": [
    { title: "LG 34\" Ultrawide", keyword: "lg+34+ultrawide+monitor", price: "£399", image: img("ultrawide monitor") },
    { title: "Dell U3423WE Ultrawide", keyword: "dell+u3423we+ultrawide", price: "£799", image: img("dell monitor") },
    { title: "Samsung Odyssey G9", keyword: "samsung+odyssey+g9", price: "£999", image: img("gaming monitor") },
    { title: "BenQ PD3220U 4K", keyword: "benq+pd3220u+4k+monitor", price: "£899", image: img("4k monitor") },
    { title: "AOC 27\" 4K Monitor", keyword: "aoc+27+4k+monitor", price: "£299", image: img("desktop monitor") },
  ],
  "fire-pit": [
    { title: "Solo Stove Bonfire 2.0", keyword: "solo+stove+bonfire", price: "£259", image: img("fire pit") },
    { title: "Outland Propane Fire Pit", keyword: "outland+propane+fire+pit", price: "£229", image: img("propane fire pit") },
    { title: "VonHaus Steel Fire Pit", keyword: "vonhaus+steel+fire+pit", price: "£89", image: img("garden fire pit") },
    { title: "La Hacienda Chiminea", keyword: "la+hacienda+chiminea", price: "£149", image: img("chiminea") },
    { title: "Cosi Cosiscoop Gas Fire", keyword: "cosi+cosiscoop+gas+fire", price: "£199", image: img("gas fire bowl") },
  ],
  "grill": [
    { title: "Weber Genesis II E-335", keyword: "weber+genesis+ii+e335", price: "£999", image: img("weber bbq") },
    { title: "Traeger Pro 575 WiFi", keyword: "traeger+pro+575", price: "£749", image: img("traeger smoker") },
    { title: "Napoleon Rogue 425", keyword: "napoleon+rogue+425", price: "£599", image: img("gas grill") },
    { title: "Char-Broil Gas Grill", keyword: "char+broil+gas+grill", price: "£299", image: img("bbq grill") },
    { title: "Kamado Joe Classic III", keyword: "kamado+joe+classic+iii", price: "£1,299", image: img("kamado grill") },
  ],
  "patio-furniture": [
    { title: "Outdoor Rattan Sectional Set", keyword: "rattan+outdoor+sectional+set", price: "£799", image: img("patio furniture") },
    { title: "Keter Corfu Lounge Set", keyword: "keter+corfu+lounge+set", price: "£349", image: img("garden lounge") },
    { title: "Aluminium Garden Dining Set", keyword: "aluminium+garden+dining+set", price: "£649", image: img("garden dining") },
    { title: "Polywood Adirondack Chairs", keyword: "polywood+adirondack+chairs", price: "£299", image: img("adirondack chairs") },
    { title: "Hanging Egg Chair with Stand", keyword: "hanging+egg+chair+stand", price: "£249", image: img("egg chair") },
  ],
  "patio-heater": [
    { title: "Hiland Pyramid Patio Heater", keyword: "hiland+pyramid+patio+heater", price: "£299", image: img("patio heater") },
    { title: "Outsunny Wall Mounted Heater", keyword: "outsunny+wall+mounted+patio+heater", price: "£89", image: img("outdoor heater") },
    { title: "Kingfisher Gas Patio Heater", keyword: "kingfisher+gas+patio+heater", price: "£179", image: img("gas heater") },
    { title: "Activa Electric Heater", keyword: "activa+electric+patio+heater", price: "£129", image: img("electric heater") },
    { title: "Firefly Tabletop Heater", keyword: "firefly+tabletop+patio+heater", price: "£69", image: img("tabletop heater") },
  ],
  "garden-lighting": [
    { title: "Solar Pathway Lights (12 Pack)", keyword: "solar+pathway+lights", price: "£39", image: img("garden lights") },
    { title: "Philips Hue Outdoor Lily", keyword: "philips+hue+outdoor+lily", price: "£249", image: img("outdoor smart lights") },
    { title: "Lights4fun Festoon Lights", keyword: "lights4fun+festoon+lights", price: "£49", image: img("festoon lights") },
    { title: "Solar Wall Lanterns", keyword: "solar+wall+lantern+outdoor", price: "£35", image: img("solar lantern") },
    { title: "LED Garden Spike Lights", keyword: "led+garden+spike+lights", price: "£29", image: img("garden spotlight") },
  ],
  "irrigation": [
    { title: "Rachio 3 Smart Sprinkler", keyword: "rachio+3+smart+sprinkler", price: "£199", image: img("smart sprinkler") },
    { title: "Hozelock Cloud Controller", keyword: "hozelock+cloud+controller", price: "£99", image: img("irrigation system") },
    { title: "Gardena Smart Water Control", keyword: "gardena+smart+water+control", price: "£129", image: img("garden hose") },
    { title: "Drip Irrigation Kit 50m", keyword: "drip+irrigation+kit", price: "£49", image: img("drip irrigation") },
    { title: "Karcher Rain System", keyword: "karcher+rain+system", price: "£89", image: img("watering system") },
  ],
  "hot-tub": [
    { title: "Lay-Z-Spa Paris Hot Tub", keyword: "lay+z+spa+paris+hot+tub", price: "£599", image: img("hot tub") },
    { title: "Intex PureSpa Inflatable", keyword: "intex+purespa+hot+tub", price: "£549", image: img("inflatable hot tub") },
    { title: "Cleverspa Maevea Hot Tub", keyword: "cleverspa+maevea+hot+tub", price: "£499", image: img("garden spa") },
    { title: "MSpa Comfort Aurora", keyword: "mspa+comfort+aurora", price: "£649", image: img("mspa hot tub") },
    { title: "Wave Atlantic 6 Person Spa", keyword: "wave+atlantic+6+person+hot+tub", price: "£799", image: img("6 person hot tub") },
  ],
};

const fallbackByRoom: Record<string, Product[]> = {
  kitchen: [
    { title: "Modern Kitchen Decor Set", keyword: "modern+kitchen+decor", price: "£49", image: img("kitchen decor") },
    { title: "Wooden Utensil Set", keyword: "wooden+kitchen+utensil+set", price: "£25", image: img("kitchen utensils") },
    { title: "Marble Worktop Saver", keyword: "marble+worktop+saver", price: "£35", image: img("kitchen worktop") },
    { title: "Brass Cabinet Handles", keyword: "brass+cabinet+handles", price: "£29", image: img("cabinet handles") },
    { title: "Smart Kitchen Scales", keyword: "smart+kitchen+scales", price: "£39", image: img("kitchen scales") },
  ],
  bedroom: [
    { title: "Luxury Bedding Set", keyword: "luxury+bedding+set", price: "£79", image: img("bedding") },
    { title: "Memory Foam Pillows", keyword: "memory+foam+pillows", price: "£45", image: img("pillows") },
    { title: "Velvet Throw Blanket", keyword: "velvet+throw+blanket", price: "£35", image: img("throw blanket") },
    { title: "Bedside Table Lamp", keyword: "bedside+table+lamp", price: "£39", image: img("bedside lamp") },
    { title: "Blackout Curtains", keyword: "blackout+curtains", price: "£49", image: img("curtains bedroom") },
  ],
  "living-room": [
    { title: "Modern Throw Pillows", keyword: "modern+throw+pillows", price: "£29", image: img("throw pillows") },
    { title: "Large Area Rug", keyword: "large+area+rug+living+room", price: "£129", image: img("living room rug") },
    { title: "Floor Lamp Arc Design", keyword: "arc+floor+lamp", price: "£119", image: img("floor lamp") },
    { title: "Wall Art Canvas Set", keyword: "wall+art+canvas+set", price: "£59", image: img("wall art") },
    { title: "Storage Coffee Table", keyword: "storage+coffee+table", price: "£189", image: img("coffee table") },
  ],
  bathroom: [
    { title: "Spa Bathroom Accessories", keyword: "spa+bathroom+accessories", price: "£39", image: img("bathroom accessories") },
    { title: "Bamboo Bath Mat", keyword: "bamboo+bath+mat", price: "£25", image: img("bath mat") },
    { title: "Egyptian Cotton Towels", keyword: "egyptian+cotton+towels", price: "£45", image: img("bath towels") },
    { title: "Rain Shower Head", keyword: "rain+shower+head", price: "£59", image: img("shower head") },
    { title: "Bathroom Storage Cabinet", keyword: "bathroom+storage+cabinet", price: "£99", image: img("bathroom cabinet") },
  ],
  office: [
    { title: "Ergonomic Office Chair", keyword: "ergonomic+office+chair", price: "£249", image: img("office chair") },
    { title: "Monitor Riser Stand", keyword: "monitor+riser+stand", price: "£39", image: img("monitor stand") },
    { title: "Desk Organiser Set", keyword: "desk+organiser+set", price: "£29", image: img("desk organiser") },
    { title: "LED Desk Lamp USB", keyword: "led+desk+lamp+usb", price: "£35", image: img("desk lamp") },
    { title: "Acoustic Wall Panels", keyword: "acoustic+wall+panels+office", price: "£59", image: img("acoustic panels") },
  ],
  garden: [
    { title: "Garden Decor Set", keyword: "garden+decor", price: "£39", image: img("garden decor") },
    { title: "Outdoor Planters Large", keyword: "outdoor+planters+large", price: "£59", image: img("garden planters") },
    { title: "Solar Garden Lights", keyword: "solar+garden+lights", price: "£29", image: img("solar lights") },
    { title: "Artificial Grass Roll", keyword: "artificial+grass+roll", price: "£89", image: img("artificial grass") },
    { title: "Wooden Garden Bench", keyword: "wooden+garden+bench", price: "£149", image: img("garden bench") },
  ],
  exterior: [
    { title: "Outdoor Wall Lights", keyword: "outdoor+wall+lights", price: "£49", image: img("outdoor wall light") },
    { title: "House Number Plaque", keyword: "modern+house+number+plaque", price: "£25", image: img("house number") },
    { title: "Composite Decking Boards", keyword: "composite+decking+boards", price: "£199", image: img("decking") },
    { title: "Smart Video Doorbell", keyword: "smart+video+doorbell", price: "£99", image: img("video doorbell") },
    { title: "Front Door Mat Heavy Duty", keyword: "heavy+duty+door+mat", price: "£29", image: img("door mat") },
  ],
};

const buildAmazonUrl = (keyword: string) =>
  `https://www.amazon.co.uk/s?k=${keyword}&tag=${AMAZON_AFFILIATE_TAG}`;

interface AffiliateProductsProps {
  selectedAppliances: string[];
  roomType: string | null;
}

export const AffiliateProducts = ({ selectedAppliances, roomType }: AffiliateProductsProps) => {
  const recs: Product[] = [];
  const seen = new Set<string>();

  selectedAppliances.forEach((id) => {
    productsByAppliance[id]?.forEach((p) => {
      if (!seen.has(p.title)) {
        seen.add(p.title);
        recs.push(p);
      }
    });
  });

  if (recs.length < 5 && roomType && fallbackByRoom[roomType]) {
    fallbackByRoom[roomType].forEach((p) => {
      if (!seen.has(p.title)) {
        seen.add(p.title);
        recs.push(p);
      }
    });
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
          Curated picks from Amazon UK based on your selections
        </p>

        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {recs.map((p) => (
            <div
              key={p.title}
              className="group border border-border rounded-lg overflow-hidden hover:border-primary/50 hover:shadow-elegant transition-all"
            >
              <div className="aspect-[4/3] bg-muted overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm leading-tight">{p.title}</h4>
                  <span className="text-xs font-bold text-primary whitespace-nowrap">
                    {p.price}
                  </span>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full mt-1 group-hover:bg-primary group-hover:text-primary-foreground"
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
            </div>
          ))}
        </div>

        <p className="text-[10px] text-muted-foreground mt-4 pt-3 border-t border-border">
          As an Amazon Associate we earn from qualifying purchases.
        </p>
      </Card>
    </aside>
  );
};
