export const messages = {
  loading: 'Loading…',
  pageTitle: 'Sync Consulting',
  header: {
    line1: 'SYNC',
    line2: 'CONSULTING',
    line3: '',
    navAriaLabel: 'Primary',
    links: [
      { label: 'Projects', href: '#projects' },
      { label: 'Services', href: '#services' },
      { label: 'Approach', href: '#approach' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  hero: {
    brand: '',
    headline: 'Sonja Hensby\n Interior Designer.',
    subcopy: '',
    primaryCtaLabel: '',
    primaryCtaHref: '#contact',
    secondaryCtaLabel: '',
    secondaryCtaHref: '#services',
  },
  filmstrip: {
    ariaLabel: 'Project stills',
    images: [
      {
        src: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
        alt: 'Dining room with artwork',
      },
      {
        src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80',
        alt: 'Open shelving niche',
      },
      {
        src: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=900&q=80',
        alt: 'Bedroom',
      },
      {
        src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
        alt: 'Entry and coat wall',
      },
      {
        src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
        alt: 'Dining space',
      },
      {
        src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
        alt: 'Library alcove',
      },
    ],
  },
  services: {
    heading: 'What we sync',
    intro: 'Practical systems for growing teams — light enough to adopt, strong enough to stick.',
    items: [
      {
        title: 'Operating cadence',
        description: 'Install a weekly rhythm that keeps priorities visible and decisions moving.',
        icon: '01',
      },
      {
        title: 'Delivery systems',
        description: 'Tighten the path from idea to shipped work without adding ceremony.',
        icon: '02',
      },
      {
        title: 'Org alignment',
        description: 'Translate strategy into ownership maps teams can actually run.',
        icon: '03',
      },
    ],
  },
  approach: {
    heading: 'How engagement works',
    body: 'We embed for a focused sprint, map the friction, and leave you with a cadence your team owns — not a deck that gathers dust.',
    ctaLabel: 'Talk with us',
    ctaHref: '#contact',
    imageSrc:
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Calm interior workspace',
  },
  contact: {
    heading: 'Ready to sync?',
    body: 'Tell us where the handoffs break. We’ll propose a focused engagement within a week.',
    ctaLabel: 'Email Sync Consulting',
    email: 'hello@syncconsulting.example',
  },
  footer: {
    brand: 'Sync Consulting',
    contact: 'hello@syncconsulting.example',
    links: [
      { label: 'Services', href: '#services' },
      { label: 'Approach', href: '#approach' },
      { label: 'Contact', href: '#contact' },
    ],
  },
  defaults: {
    colourLabel: 'Accent colour',
    heading: 'Heading',
    paragraph: 'Supporting paragraph goes here.',
    buttonLabel: 'Get started',
    imageAlt: 'Team collaborating',
    newServiceTitle: 'New service',
    newServiceDescription: 'Describe the offer.',
    navLink: 'Page',
    filmstripImageAlt: 'Interior',
  },
} as const
