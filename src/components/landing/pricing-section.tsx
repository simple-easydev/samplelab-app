"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Basic",
    monthlyPrice: 19,
    yearlyPrice: 15,
    credits: "250 credits",
    features: ["Basic library", "1 user", "Community access"],
    highlighted: false,
  },
  {
    name: "Pro",
    monthlyPrice: 129,
    yearlyPrice: 99,
    credits: "1000 credits",
    features: ["Full library", "3 users", "Priority support", "Private community"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: 299,
    yearlyPrice: 249,
    credits: "Unlimited credits",
    features: ["Full library", "10 users", "Dedicated support", "Custom integrations"],
    highlighted: false,
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(true);

  return (
    <section id="pricing" className="border-b border-border bg-background py-16 md:py-24">
      <div className="container px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Start a 3-day free trial
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Choose the plan that suits you.
        </p>
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center rounded-lg border border-border bg-muted/30 p-1">
            <button
              type="button"
              onClick={() => setYearly(false)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                !yearly ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setYearly(true)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                yearly ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Yearly
            </button>
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          </div>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted ? "border-2 border-primary shadow-lg" : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge>BEST VALUE</Badge>
                </div>
              )}
              <CardHeader className="pb-2">
                <h3 className="text-xl font-semibold">{plan.name}</h3>
                <p className="text-2xl font-bold">
                  ${yearly ? plan.yearlyPrice : plan.monthlyPrice}.00{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    / mo
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">{plan.credits}</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-primary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  asChild
                >
                  <a href="#trial">Start free trial</a>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
