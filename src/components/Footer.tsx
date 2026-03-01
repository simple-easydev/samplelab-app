/**
 * Footer from Figma (node 812-51974) – dark background, link columns, logo, copyright.
 */
import { Link } from 'react-router-dom';
import { BigLogo, SoundCloudIcon, InstagramIcon } from '@/components/icons';

const FOOTER_ICONS = {
  soundcloud: SoundCloudIcon,
  instagram: InstagramIcon,
} as const;

type FooterIconKey = keyof typeof FOOTER_ICONS;

const FOOTER_COLUMNS = [
  {
    heading: 'Product',
    links: [
      { label: 'Browse', to: '/dashboard' },
      { label: 'Genres', to: '#' },
      { label: 'Pricing', to: '/onboarding' },
      { label: 'How It Works', to: '#' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Log In', to: '/login' },
      { label: 'Sign Up', to: '/login' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Help Center', to: '#' },
      { label: 'Contact Support', to: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Terms & Conditions', to: '#' },
      { label: 'Privacy Policy', to: '#' },
    ],
  },
  {
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
      <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col gap-16">
        {/* Link columns */}
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

        {/* Big logo watermark */}
        <div className="flex justify-center w-full">
          <BigLogo className="w-full h-auto" />
        </div>

        {/* Copyright row */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
          <p>© {new Date().getFullYear()} The Sample Lab. All rights reserved.</p>
          <p>Made for music creators</p>
        </div>
      </div>
    </footer>
  );
}
