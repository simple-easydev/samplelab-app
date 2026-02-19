"use client";

import { Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const featuredItems = [
  { title: "Acoustic Beat 01", artist: "The Sample Lab", length: "0:15", bpm: 120, price: "$10.00" },
  { title: "Electric Piano 02", artist: "The Sample Lab", length: "0:22", bpm: 90, price: "$8.00" },
  { title: "Strings Loop 03", artist: "The Sample Lab", length: "0:18", bpm: 100, price: "$12.00" },
  { title: "Bass Line 04", artist: "The Sample Lab", length: "0:12", bpm: 110, price: "$6.00" },
  { title: "Pad Swell 05", artist: "The Sample Lab", length: "0:30", bpm: 80, price: "$15.00" },
  { title: "Percussion 06", artist: "The Sample Lab", length: "0:08", bpm: 130, price: "$5.00" },
];

function SampleCard({
  title,
  artist,
  length,
  bpm,
  price,
  withPlay = false,
}: {
  title: string;
  artist: string;
  length: string;
  bpm: number;
  price: string;
  withPlay?: boolean;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative aspect-square bg-muted">
        {withPlay && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Play className="size-5 fill-current" />
            </Button>
          </div>
        )}
      </div>
      <CardContent className="p-3">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{artist}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between border-t px-3 py-2 text-sm text-muted-foreground">
        <span>
          {length} / {bpm} BPM / {price}
        </span>
        <Button variant="ghost" size="icon" className="size-8 shrink-0">
          <span className="sr-only">Add</span>
          +
        </Button>
      </CardFooter>
    </Card>
  );
}

export function FeaturedPicks() {
  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4">
        <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Featured Picks
        </h2>
        <Tabs defaultValue="samples" className="mt-8">
          <TabsList className="mb-6">
            <TabsTrigger value="samples">Samples</TabsTrigger>
            <TabsTrigger value="packs">Packs</TabsTrigger>
          </TabsList>
          <TabsContent value="samples" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {featuredItems.map((item, i) => (
                <SampleCard
                  key={item.title}
                  {...item}
                  withPlay={i % 2 === 0}
                />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="packs" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {featuredItems.slice(0, 6).map((item, i) => (
                <SampleCard
                  key={`pack-${item.title}`}
                  {...item}
                  withPlay={i % 3 === 0}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
