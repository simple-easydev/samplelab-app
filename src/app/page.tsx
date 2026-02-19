import {
  Hero,
  SubscriptionSection,
  TrendingSection,
  FeaturedPicks,
  DiscoverSection,
  LicensingSection,
  PricingSection,
  FAQSection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Hero />
        <SubscriptionSection />
        <TrendingSection />
        <FeaturedPicks />
        <DiscoverSection />
        <LicensingSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
