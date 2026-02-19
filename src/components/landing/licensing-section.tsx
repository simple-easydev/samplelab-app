import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LicensingSection() {
  return (
    <section className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div className="flex gap-4">
            <div className="aspect-[4/5] w-1/2 rounded-xl bg-muted" />
            <div className="aspect-[4/5] w-1/2 -ml-8 mt-8 rounded-xl bg-muted" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Clear licensing, no guesswork.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            <Button variant="outline" size="lg" className="mt-6" asChild>
              <Link href="#licensing">Learn more</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
