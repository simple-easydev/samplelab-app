import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  "Access high-quality sounds",
  "Curated by industry music",
  "Clear sound design",
];

const metrics = [
  { value: "500+", label: "Sample packs" },
  { value: "30+", label: "New releases" },
  { value: "10+", label: "Artists" },
  { value: "3", label: "Years" },
];

export function Hero() {
  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            All the sounds you need. One subscription.
          </h1>
          <ul className="mt-6 flex flex-col gap-2 text-muted-foreground md:flex-row md:justify-center md:gap-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center justify-center gap-2">
                <span className="size-1.5 rounded-full bg-foreground" />
                {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="#trial">Start free trial</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#browse">Explore samples</Link>
            </Button>
          </div>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="aspect-video flex-1 rounded-xl bg-muted" />
            <div className="flex flex-col gap-4 md:w-1/3">
              <div className="aspect-video rounded-xl bg-muted" />
              <div className="aspect-video rounded-xl bg-muted" />
            </div>
          </div>
          <div className="hidden aspect-video rounded-xl bg-muted md:block" />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold text-foreground md:text-3xl">
                {value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
