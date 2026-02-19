"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

const genres = [
  "Hip Hop",
  "Trap",
  "Funk",
  "Electronic",
  "R&B",
  "Pop",
  "Reggaeton",
  "Lo-Fi",
];

const discoverItems = [
  { title: "King Base Beatbox", artist: "The Sample Lab", price: "$12.00" },
  { title: "Street Drums 01", artist: "The Sample Lab", price: "$8.00" },
  { title: "Boom Bap Kit", artist: "The Sample Lab", price: "$15.00" },
  { title: "Soul Chop 02", artist: "The Sample Lab", price: "$10.00" },
  { title: "Vinyl Scratch", artist: "The Sample Lab", price: "$6.00" },
  { title: "808 Melody", artist: "The Sample Lab", price: "$9.00" },
];

export function DiscoverSection() {
  const [activeGenre, setActiveGenre] = useState("Hip Hop");

  return (
    <section className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Discover hip-hop packs & samples
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {genres.map((genre) => (
            <Button
              key={genre}
              variant={activeGenre === genre ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveGenre(genre)}
            >
              {genre}
            </Button>
          ))}
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {discoverItems.map((item, i) => (
            <Card key={item.title} className="overflow-hidden transition-shadow hover:shadow-md">
              <div className="relative aspect-square bg-muted">
                {i % 2 === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Play className="size-5 fill-current" />
                    </Button>
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.artist}</p>
              </CardContent>
              <CardFooter className="px-3 py-2 text-sm text-muted-foreground">
                {item.price}
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Button variant="outline">Load more samples</Button>
        </div>
      </div>
    </section>
  );
}
