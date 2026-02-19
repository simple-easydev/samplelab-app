import Link from "next/link";

const productLinks = [
  { href: "/", label: "Home" },
  { href: "#faq", label: "FAQ" },
  { href: "#", label: "Blog" },
  { href: "#", label: "Contact" },
  { href: "#", label: "Docs" },
];

const aboutLinks = [
  { href: "#", label: "Team" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Press" },
  { href: "#", label: "Partners" },
];

const legalLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "License" },
  { href: "#", label: "Cookies" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "Facebook" },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container px-4 py-16">
        <p className="text-center text-4xl font-bold opacity-20 md:text-5xl">
          The Sample Lab
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
          <div>
            <h3 className="font-semibold">Product</h3>
            <ul className="mt-4 space-y-2">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">About</h3>
            <ul className="mt-4 space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Social</h3>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 pt-8 md:flex-row">
          <p className="text-sm text-primary-foreground/80">
            © 2023 The Sample Lab. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link
              href="#"
              className="text-primary-foreground/80 hover:text-primary-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-primary-foreground/80 hover:text-primary-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
