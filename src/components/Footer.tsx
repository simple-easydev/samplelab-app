/**
 * Footer from Figma (node 812-51974) – dark background, link columns, logo, copyright.
 * Mobile: accordion layout (Figma 1382-149633). Desktop: column layout.
 */
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BigLogo, SoundCloudIcon, InstagramIcon } from '@/components/icons';

const FOOTER_ICONS = {
  soundcloud: SoundCloudIcon,
  instagram: InstagramIcon,
} as const;

type FooterIconKey = keyof typeof FOOTER_ICONS;

const FOOTER_COLUMNS = [
  {
    id: 'product',
    heading: 'Product',
    links: [
      { label: 'Browse', to: '/dashboard/discover' },
      { label: 'Genres', to: '#' },
      { label: 'Pricing', to: '/onboarding' },
      { label: 'How It Works', to: '#' },
    ],
  },
  {
    id: 'account',
    heading: 'Account',
    links: [
      { label: 'Log In', to: '/login' },
      { label: 'Sign Up', to: '/login' },
    ],
  },
  {
    id: 'support',
    heading: 'Support',
    links: [
      { label: 'Help Center', to: '#' },
      { label: 'Contact Support', to: '#' },
    ],
  },
  {
    id: 'legal',
    heading: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
  },
  {
    id: 'social',
    heading: 'Social',
    links: [
      { label: 'SoundCloud', icon: 'soundcloud' as FooterIconKey, href: 'https://soundcloud.com', external: true },
      { label: 'Instagram', icon: 'instagram' as FooterIconKey, href: 'https://instagram.com', external: true },
    ],
  },
] as const;

const linkClassName =
  'flex items-center gap-2 text-[#7f7766] text-sm leading-5 tracking-[0.1px] hover:text-[#e8e2d2] transition-colors';
const iconClassName = 'size-5 shrink-0 [&_path]:fill-current';

export function Footer() {
  return (
    <footer className="bg-[#161410] w-full shrink-0">
      {/* Mobile footer — Figma 1382-149633: accordion */}
      <div className="md:hidden px-4 pt-6 pb-4 flex flex-col gap-12">
        <Accordion
          type="single"
          defaultValue="product"
          collapsible
          className="flex flex-col gap-0 w-full"
        >
          {FOOTER_COLUMNS.map((column) => (
            <AccordionItem
              key={column.id}
              value={column.id}
              className="border-[#2a2622] border-b last:border-b-0"
            >
              <AccordionTrigger className="py-2.5 px-0 text-[#e8e2d2] text-[10px] leading-4 tracking-[1px] uppercase font-normal hover:no-underline hover:text-[#e8e2d2] [&[data-state=open]>svg]:rotate-180 [&>svg]:size-6 [&>svg]:text-[#e8e2d2]">
                {column.heading}
              </AccordionTrigger>
              <AccordionContent className="pb-2 pt-0">
                <div className="flex flex-col gap-2">
                  {column.links.map((item) => {
                    const iconKey = 'icon' in item ? item.icon : null;
                    const IconComponent = iconKey ? FOOTER_ICONS[iconKey] : null;
                    const content = (
                      <>
                        {IconComponent && (
                          <IconComponent className={iconClassName} aria-hidden />
                        )}
                        {item.label}
                      </>
                    );

                    if ('external' in item && item.external && item.href) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClassName}
                        >
                          {content}
                        </a>
                      );
                    }

                    const to = 'to' in item ? item.to : '#';
                    return (
                      <Link key={item.label} to={to} className={linkClassName}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex justify-center w-full">
          <BigLogo className="w-full max-w-[280px] h-auto opacity-80" />
        </div>

        <div className="flex flex-col gap-3 items-center text-center text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
          <p>Made for music creators</p>
          <p>© {new Date().getFullYear()} The Sample Lab. All rights reserved.</p>
        </div>
      </div>

      {/* Desktop footer — column layout */}
      <div className="hidden md:block">
        <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-16">
          <div className="flex flex-wrap justify-between">
            {FOOTER_COLUMNS.map((column) => (
              <div
                key={column.heading}
                className="flex flex-col gap-4 min-w-[120px]"
              >
                <p className="text-[#e8e2d2] text-[10px] leading-4 tracking-[1px] uppercase">
                  {column.heading}
                </p>
                <div className="flex flex-col gap-4">
                  {column.links.map((item) => {
                    const iconKey = 'icon' in item ? item.icon : null;
                    const IconComponent = iconKey ? FOOTER_ICONS[iconKey] : null;
                    const content = (
                      <>
                        {IconComponent && (
                          <IconComponent className={iconClassName} aria-hidden />
                        )}
                        {item.label}
                      </>
                    );

                    if ('external' in item && item.external && item.href) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={linkClassName}
                        >
                          {content}
                        </a>
                      );
                    }

                    const to = 'to' in item ? item.to : '#';
                    return (
                      <Link key={item.label} to={to} className={linkClassName}>
                        {content}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center w-full">
            <BigLogo className="w-full h-auto" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
            <p>© {new Date().getFullYear()} The Sample Lab. All rights reserved.</p>
            <p>Made for music creators</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
