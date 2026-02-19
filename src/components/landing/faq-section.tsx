import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "How does The Sample Lab work?",
    answer:
      "Subscribe to a plan, browse our library of high-quality sounds, and download what you need. Use the samples in your projects with clear licensing—no guesswork.",
  },
  {
    question: "Can I use the samples in commercial projects?",
    answer:
      "Yes. All plans include commercial use rights. Check the license details for your plan for full terms.",
  },
  {
    question: "What formats are the samples available in?",
    answer:
      "Samples are available in WAV and MP3. You can choose your preferred format when downloading.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes. You can cancel anytime. You'll keep access until the end of your billing period.",
  },
];

export function FAQSection() {
  return (
    <section className="border-b border-border bg-muted/30 py-16 md:py-24">
      <div className="container px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Got questions?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Find answers to common questions about The Sample Lab, licensing, and your subscription.
            </p>
            <Button variant="outline" size="lg" className="mt-6" asChild>
              <Link href="#faq">View all FAQs</Link>
            </Button>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.question} value={`item-${i}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
