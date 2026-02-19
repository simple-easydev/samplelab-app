import Link from "next/link";

const trendingSamples = [
  { title: "Ambient groove 01", artist: "The Sample Lab", length: "0:32" },
  { title: "Drum hit 03", artist: "The Sample Lab", length: "0:08" },
  { title: "Bass loop 02", artist: "The Sample Lab", length: "0:16" },
  { title: "Synth pad 04", artist: "The Sample Lab", length: "0:24" },
];

const newReleases = [
  { title: "Bass hit 05", artist: "The Sample Lab", length: "0:08" },
  { title: "Chillwave pads", artist: "The Sample Lab", length: "0:45" },
  { title: "808 kit 01", artist: "The Sample Lab", length: "0:16" },
  { title: "Vocal chop 02", artist: "The Sample Lab", length: "0:12" },
];

const topCreators = [
  { name: "John Doe", role: "Producer" },
  { name: "Jane Smith", role: "Sound Designer" },
  { name: "Alex Brown", role: "Beatmaker" },
  { name: "Sam Wilson", role: "Composer" },
];

function SampleCard({
  title,
  artist,
  length,
}: {
  title: string;
  artist: string;
  length: string;
}) {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
    >
      <div className="size-12 shrink-0 rounded bg-muted" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {artist} · {length}
        </p>
      </div>
    </Link>
  );
}

function CreatorCard({ name, role }: { name: string; role: string }) {
  return (
    <Link
      href="#"
      className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
    >
      <div className="size-12 shrink-0 rounded-full bg-muted" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{name}</p>
        <p className="truncate text-sm text-muted-foreground">{role}</p>
      </div>
    </Link>
  );
}

export function TrendingSection() {
  return (
    <section id="browse" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4">
        <p className="text-center text-sm font-medium text-muted-foreground">
          Trending across The Sample Lab
        </p>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Explore what&apos;s new
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Trending samples
            </h3>
            <div className="mt-4 space-y-1">
              {trendingSamples.map((s) => (
                <SampleCard key={s.title} {...s} />
              ))}
            </div>
            <Link
              href="#"
              className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              View all samples
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              New Releases
            </h3>
            <div className="mt-4 space-y-1">
              {newReleases.map((s) => (
                <SampleCard key={s.title} {...s} />
              ))}
            </div>
            <Link
              href="#"
              className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              View all releases
            </Link>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Top Creators
            </h3>
            <div className="mt-4 space-y-1">
              {topCreators.map((c) => (
                <CreatorCard key={c.name} {...c} />
              ))}
            </div>
            <Link
              href="#artists"
              className="mt-4 inline-block text-sm font-medium text-foreground underline underline-offset-4 hover:no-underline"
            >
              View all creators
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
