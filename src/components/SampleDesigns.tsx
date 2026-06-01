import livingBefore from "@/assets/samples/living-before.jpg";
import livingAfter from "@/assets/samples/living-after.jpg";
import bedroomBefore from "@/assets/samples/bedroom-before.jpg";
import bedroomAfter from "@/assets/samples/bedroom-after.jpg";
import kitchenBefore from "@/assets/samples/kitchen-before.jpg";
import kitchenAfter from "@/assets/samples/kitchen-after.jpg";
import { ArrowRight } from "lucide-react";

const samples = [
  { title: "Living Room", style: "Scandinavian", before: livingBefore, after: livingAfter },
  { title: "Bedroom", style: "Japandi", before: bedroomBefore, after: bedroomAfter },
  { title: "Kitchen", style: "Industrial Modern", before: kitchenBefore, after: kitchenAfter },
];

export const SampleDesigns = () => {
  return (
    <section className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">See what's possible</h2>
        <p className="text-muted-foreground">
          Sample transformations created with AI Designer
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {samples.map((s) => (
          <div
            key={s.title}
            className="rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-2 gap-px bg-border">
              <div className="relative bg-background">
                <img
                  src={s.before}
                  alt={`${s.title} before redesign`}
                  loading="lazy"
                  width={768}
                  height={512}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-background/90 text-foreground px-2 py-0.5 rounded">
                  Before
                </span>
              </div>
              <div className="relative bg-background">
                <img
                  src={s.after}
                  alt={`${s.title} after redesign in ${s.style} style`}
                  loading="lazy"
                  width={768}
                  height={512}
                  className="w-full h-40 object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded">
                  After
                </span>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold">{s.title}</p>
                <p className="text-sm text-muted-foreground">{s.style}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
