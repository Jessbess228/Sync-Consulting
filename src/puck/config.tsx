import type { Config, Data, Slot } from '@puckeditor/core'

export type SyncComponents = {
  Hero: {
    brand: string
    headline: string
    subcopy: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    imageUrl: string
  }
  Section: {
    background: 'deep' | 'panel' | 'grid'
    width: 'default' | 'narrow'
    padding: 'sm' | 'md' | 'lg'
    content: Slot
  }
  Columns: {
    columns: '2' | '3'
    gap: number
    content: Slot
  }
  Heading: {
    text: string
    level: 'h1' | 'h2' | 'h3'
    align: 'left' | 'center'
  }
  Text: {
    text: string
    align: 'left' | 'center'
  }
  Image: {
    src: string
    alt: string
  }
  Button: {
    label: string
    href: string
    variant: 'primary' | 'ghost'
  }
  Services: {
    items: Array<{ title: string; description: string; icon: string }>
  }
  Spacer: {
    size: number
  }
  Divider: Record<string, never>
  Footer: {
    brand: string
    contact: string
    link1Label: string
    link1Href: string
    link2Label: string
    link2Href: string
    link3Label: string
    link3Href: string
  }
}

export const puckConfig: Config<SyncComponents> = {
  components: {
    Hero: {
      label: 'Hero',
      fields: {
        brand: { type: 'text', label: 'Brand' },
        headline: { type: 'text', label: 'Headline' },
        subcopy: { type: 'textarea', label: 'Supporting copy' },
        primaryCtaLabel: { type: 'text', label: 'Primary CTA label' },
        primaryCtaHref: { type: 'text', label: 'Primary CTA href' },
        secondaryCtaLabel: { type: 'text', label: 'Secondary CTA label' },
        secondaryCtaHref: { type: 'text', label: 'Secondary CTA href' },
        imageUrl: { type: 'text', label: 'Background image URL (optional)' },
      },
      defaultProps: {
        brand: 'Sync Consulting',
        headline: 'Get your teams in sync.',
        subcopy:
          'We align ops, product, and engineering so delivery stops thrashing and starts compounding.',
        primaryCtaLabel: 'Book a call',
        primaryCtaHref: '#contact',
        secondaryCtaLabel: 'See services',
        secondaryCtaHref: '#services',
        imageUrl: '',
      },
      render: ({
        brand,
        headline,
        subcopy,
        primaryCtaLabel,
        primaryCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
        imageUrl,
      }) => (
        <section className="sc-hero">
          <div className="sc-hero__media" aria-hidden="true">
            {imageUrl ? <img src={imageUrl} alt="" /> : null}
          </div>
          <div className="sc-hero__content">
            <p className="sc-brand">{brand}</p>
            <h1>{headline}</h1>
            <p>{subcopy}</p>
            <div className="sc-cta-row">
              {primaryCtaLabel ? (
                <a className="sc-btn sc-btn--primary" href={primaryCtaHref}>
                  {primaryCtaLabel}
                </a>
              ) : null}
              {secondaryCtaLabel ? (
                <a className="sc-btn sc-btn--ghost" href={secondaryCtaHref}>
                  {secondaryCtaLabel}
                </a>
              ) : null}
            </div>
          </div>
        </section>
      ),
    },

    Section: {
      label: 'Section',
      fields: {
        background: {
          type: 'radio',
          label: 'Background',
          options: [
            { label: 'Deep', value: 'deep' },
            { label: 'Panel', value: 'panel' },
            { label: 'Grid', value: 'grid' },
          ],
        },
        width: {
          type: 'radio',
          label: 'Width',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Narrow', value: 'narrow' },
          ],
        },
        padding: {
          type: 'select',
          label: 'Padding',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        content: { type: 'slot' },
      },
      defaultProps: {
        background: 'deep',
        width: 'default',
        padding: 'md',
        content: [],
      },
      render: ({ background, width, padding, content: Content }) => {
        const pad =
          padding === 'sm'
            ? 'clamp(1.5rem, 4vw, 2.5rem)'
            : padding === 'lg'
              ? 'clamp(4rem, 9vw, 7rem)'
              : undefined
        const bg =
          background === 'panel'
            ? 'var(--sc-panel)'
            : background === 'grid'
              ? undefined
              : 'var(--sc-deep)'
        return (
          <section
            className={`sc-section${width === 'narrow' ? ' sc-section--narrow' : ''}${
              background === 'grid' ? ' sc-grid-bg' : ''
            }`}
            style={{
              background: bg,
              paddingBlock: pad,
            }}
          >
            <div className="sc-section__inner">
              <Content />
            </div>
          </section>
        )
      },
    },

    Columns: {
      label: 'Columns',
      fields: {
        columns: {
          type: 'radio',
          label: 'Columns',
          options: [
            { label: '2', value: '2' },
            { label: '3', value: '3' },
          ],
        },
        gap: { type: 'number', label: 'Gap (px)', min: 8, max: 64 },
        content: { type: 'slot' },
      },
      defaultProps: {
        columns: '2',
        gap: 24,
        content: [],
      },
      render: ({ columns, gap, content: Content }) => (
        <Content
          className={`sc-columns sc-columns--${columns}`}
          style={{ gap }}
        />
      ),
    },

    Heading: {
      label: 'Heading',
      fields: {
        text: { type: 'text', label: 'Text' },
        level: {
          type: 'select',
          label: 'Level',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
          ],
        },
        align: {
          type: 'radio',
          label: 'Align',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
      },
      defaultProps: {
        text: 'Heading',
        level: 'h2',
        align: 'left',
      },
      render: ({ text, level, align }) => {
        const Tag = level
        return (
          <Tag
            className={`sc-heading sc-heading--${level}`}
            style={{ textAlign: align }}
          >
            {text}
          </Tag>
        )
      },
    },

    Text: {
      label: 'Text',
      fields: {
        text: { type: 'textarea', label: 'Text' },
        align: {
          type: 'radio',
          label: 'Align',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
          ],
        },
      },
      defaultProps: {
        text: 'Supporting paragraph goes here.',
        align: 'left',
      },
      render: ({ text, align }) => (
        <p className="sc-text" style={{ textAlign: align }}>
          {text}
        </p>
      ),
    },

    Image: {
      label: 'Image',
      fields: {
        src: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt text' },
      },
      defaultProps: {
        src: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        alt: 'Team collaborating',
      },
      render: ({ src, alt }) => (
        <figure className="sc-image">
          <img src={src} alt={alt} />
        </figure>
      ),
    },

    Button: {
      label: 'Button / CTA',
      fields: {
        label: { type: 'text', label: 'Label' },
        href: { type: 'text', label: 'Href' },
        variant: {
          type: 'radio',
          label: 'Variant',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      },
      defaultProps: {
        label: 'Get started',
        href: '#contact',
        variant: 'primary',
      },
      render: ({ label, href, variant }) => (
        <a
          className={`sc-btn sc-btn--${variant === 'ghost' ? 'ghost' : 'primary'}`}
          href={href}
        >
          {label}
        </a>
      ),
    },

    Services: {
      label: 'Services',
      fields: {
        items: {
          type: 'array',
          label: 'Services',
          getItemSummary: (item) => item.title || 'Service',
          arrayFields: {
            title: { type: 'text', label: 'Title' },
            description: { type: 'textarea', label: 'Description' },
            icon: { type: 'text', label: 'Icon / initials' },
          },
          defaultItemProps: {
            title: 'New service',
            description: 'Describe the offer.',
            icon: 'SC',
          },
        },
      },
      defaultProps: {
        items: [
          {
            title: 'Operating cadence',
            description:
              'Install a weekly rhythm that keeps priorities visible and decisions moving.',
            icon: '01',
          },
          {
            title: 'Delivery systems',
            description:
              'Tighten the path from idea to shipped work without adding ceremony.',
            icon: '02',
          },
          {
            title: 'Org alignment',
            description:
              'Translate strategy into ownership maps teams can actually run.',
            icon: '03',
          },
        ],
      },
      render: ({ items }) => (
        <div className="sc-services" id="services">
          {items.map((item, index) => (
            <article className="sc-service" key={`${item.title}-${index}`}>
              <div className="sc-service__icon">{item.icon || 'SC'}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      ),
    },

    Spacer: {
      label: 'Spacer',
      fields: {
        size: { type: 'number', label: 'Height (px)', min: 8, max: 240 },
      },
      defaultProps: {
        size: 32,
      },
      render: ({ size }) => (
        <div className="sc-spacer" style={{ height: size }} aria-hidden="true" />
      ),
    },

    Divider: {
      label: 'Divider',
      fields: {},
      defaultProps: {},
      render: () => <hr className="sc-divider" />,
    },

    Footer: {
      label: 'Footer',
      fields: {
        brand: { type: 'text', label: 'Brand' },
        contact: { type: 'text', label: 'Contact line' },
        link1Label: { type: 'text', label: 'Link 1 label' },
        link1Href: { type: 'text', label: 'Link 1 href' },
        link2Label: { type: 'text', label: 'Link 2 label' },
        link2Href: { type: 'text', label: 'Link 2 href' },
        link3Label: { type: 'text', label: 'Link 3 label' },
        link3Href: { type: 'text', label: 'Link 3 href' },
      },
      defaultProps: {
        brand: 'Sync Consulting',
        contact: 'hello@syncconsulting.example',
        link1Label: 'Services',
        link1Href: '#services',
        link2Label: 'Approach',
        link2Href: '#approach',
        link3Label: 'Contact',
        link3Href: '#contact',
      },
      render: ({
        brand,
        contact,
        link1Label,
        link1Href,
        link2Label,
        link2Href,
        link3Label,
        link3Href,
      }) => {
        const links = [
          { label: link1Label, href: link1Href },
          { label: link2Label, href: link2Href },
          { label: link3Label, href: link3Href },
        ].filter((link) => link.label)
        return (
          <footer className="sc-footer" id="contact">
            <div className="sc-footer__inner">
              <div>
                <p className="sc-footer__brand">{brand}</p>
                <p className="sc-footer__meta">{contact}</p>
              </div>
              <ul className="sc-footer__links">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </footer>
        )
      },
    },
  },
}

export const defaultData: Data = {
  root: { props: { title: 'Sync Consulting' } },
  content: [
    {
      type: 'Hero',
      props: {
        id: 'Hero-1',
        brand: 'Sync Consulting',
        headline: 'Get your teams in sync.',
        subcopy:
          'We align ops, product, and engineering so delivery stops thrashing and starts compounding.',
        primaryCtaLabel: 'Book a call',
        primaryCtaHref: '#contact',
        secondaryCtaLabel: 'See services',
        secondaryCtaHref: '#services',
        imageUrl: '',
      },
    },
    {
      type: 'Section',
      props: {
        id: 'Section-services',
        background: 'grid',
        width: 'default',
        padding: 'lg',
        content: [
          {
            type: 'Heading',
            props: {
              id: 'Heading-services',
              text: 'What we sync',
              level: 'h2',
              align: 'left',
            },
          },
          {
            type: 'Spacer',
            props: { id: 'Spacer-1', size: 20 },
          },
          {
            type: 'Text',
            props: {
              id: 'Text-services-intro',
              text: 'Practical systems for growing teams — light enough to adopt, strong enough to stick.',
              align: 'left',
            },
          },
          {
            type: 'Spacer',
            props: { id: 'Spacer-2', size: 28 },
          },
          {
            type: 'Services',
            props: {
              id: 'Services-1',
              items: [
                {
                  title: 'Operating cadence',
                  description:
                    'Install a weekly rhythm that keeps priorities visible and decisions moving.',
                  icon: '01',
                },
                {
                  title: 'Delivery systems',
                  description:
                    'Tighten the path from idea to shipped work without adding ceremony.',
                  icon: '02',
                },
                {
                  title: 'Org alignment',
                  description:
                    'Translate strategy into ownership maps teams can actually run.',
                  icon: '03',
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: 'Section',
      props: {
        id: 'Section-approach',
        background: 'panel',
        width: 'default',
        padding: 'lg',
        content: [
          {
            type: 'Columns',
            props: {
              id: 'Columns-approach',
              columns: '2',
              gap: 40,
              content: [
                {
                  type: 'Heading',
                  props: {
                    id: 'Heading-approach',
                    text: 'How engagement works',
                    level: 'h2',
                    align: 'left',
                  },
                },
                {
                  type: 'Text',
                  props: {
                    id: 'Text-approach',
                    text: 'We embed for a focused sprint, map the friction, and leave you with a cadence your team owns — not a deck that gathers dust.',
                    align: 'left',
                  },
                },
                {
                  type: 'Spacer',
                  props: { id: 'Spacer-3', size: 16 },
                },
                {
                  type: 'Button',
                  props: {
                    id: 'Button-approach',
                    label: 'Talk with us',
                    href: '#contact',
                    variant: 'primary',
                  },
                },
                {
                  type: 'Image',
                  props: {
                    id: 'Image-approach',
                    src: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
                    alt: 'Workshop session with sticky notes',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      type: 'Section',
      props: {
        id: 'Section-contact',
        background: 'deep',
        width: 'narrow',
        padding: 'md',
        content: [
          {
            type: 'Heading',
            props: {
              id: 'Heading-contact',
              text: 'Ready to sync?',
              level: 'h2',
              align: 'center',
            },
          },
          {
            type: 'Text',
            props: {
              id: 'Text-contact',
              text: 'Tell us where the handoffs break. We’ll propose a focused engagement within a week.',
              align: 'center',
            },
          },
          {
            type: 'Spacer',
            props: { id: 'Spacer-4', size: 20 },
          },
          {
            type: 'Button',
            props: {
              id: 'Button-contact',
              label: 'Email Sync Consulting',
              href: 'mailto:hello@syncconsulting.example',
              variant: 'primary',
            },
          },
        ],
      },
    },
    {
      type: 'Footer',
      props: {
        id: 'Footer-1',
        brand: 'Sync Consulting',
        contact: 'hello@syncconsulting.example',
        link1Label: 'Services',
        link1Href: '#services',
        link2Label: 'Approach',
        link2Href: '#approach',
        link3Label: 'Contact',
        link3Href: '#contact',
      },
    },
  ],
}
