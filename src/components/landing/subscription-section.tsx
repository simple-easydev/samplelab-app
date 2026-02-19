import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  { num: "01", title: "Discover sounds", desc: "Browse our library and find the perfect sounds for your project." },
  { num: "02", title: "Browse & download", desc: "Download high-quality samples in your preferred format." },
  { num: "03", title: "Create your next track", desc: "Use the sounds in your DAW and create something new." },
];

export function SubscriptionSection() {
  return (
    <section id="how-it-works" className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              From subscription to finished track.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Button variant="outline" size="lg" className="mt-6" asChild>
              <Link href="#learn">Learn more</Link>
            </Button>
          </div>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-4">
                <span className="text-2xl font-bold text-muted-foreground">
                  {step.num}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
