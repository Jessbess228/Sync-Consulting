import type { Config, Slot } from '@puckeditor/core'
import { messages } from '../pages/Home.messages'

export type SyncComponents = {
  Colourpicker: {
    label: string
    value: string
  }
  Header: {
    line1: string
    line2: string
    line3: string
    links: Array<{ label: string; href: string }>
  }
  Hero: {
    brand: string
    headline: string
    headlineAlign: 'left' | 'right'
    subcopy: string
    primaryCtaLabel: string
    primaryCtaHref: string
    secondaryCtaLabel: string
    secondaryCtaHref: string
    imageUrl: string
  }
  Filmstrip: {
    images: Array<{ src: string; alt: string }>
  }
  Section: {
    background: 'deep' | 'panel' | 'grid'
    width: 'default' | 'narrow'
    padding: 'sm' | 'md' | 'lg'
    anchorId: string
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

type RootProps = {
  title: string
}

export const puckConfig: Config<SyncComponents, RootProps> = {
  categories: {
    layout: {
      title: 'Layout',
      components: ['Section', 'Columns', 'Spacer', 'Divider'],
    },
    content: {
      title: 'Content',
      components: ['Header', 'Hero', 'Filmstrip', 'Heading', 'Text', 'Image', 'Button', 'Services', 'Footer', 'Colourpicker'],
    },
  },
  components: {
    Colourpicker: {
      label: 'Colourpicker',
      fields: {
        label: { type: 'text', label: 'Label' },
        value: {
          type: 'custom',
          label: 'Colour',
          render: ({ value, onChange }) => (
            <input
              type="color"
              value={value || '#1f2937'}
              onChange={(event) => onChange(event.currentTarget.value)}
              aria-label="Colour"
            />
          ),
        },
      },
      defaultProps: {
        label: messages.defaults.colourLabel,
        value: '#1f2937',
      },
      render: ({ label, value }) => (
        <div className="sc-colourpicker">
          <span
            className="sc-colourpicker__swatch"
            style={{ background: value || '#1f2937' }}
            aria-hidden="true"
          />
          <span>{label}</span>
          <code>{value || '#1f2937'}</code>
        </div>
      ),
    },

    Header: {
      label: 'Header',
      fields: {
        line1: { type: 'text', label: 'Wordmark line 1' },
        line2: { type: 'text', label: 'Wordmark line 2' },
        line3: { type: 'text', label: 'Wordmark line 3' },
        links: {
          type: 'array',
          label: 'Navigation',
          getItemSummary: (item) => item.label || 'Link',
          arrayFields: {
            label: { type: 'text', label: 'Label' },
            href: { type: 'text', label: 'Href' },
          },
          defaultItemProps: {
            label: messages.defaults.navLink,
            href: '#',
          },
        },
      },
      defaultProps: {
        line1: messages.header.line1,
        line2: messages.header.line2,
        line3: messages.header.line3,
        links: messages.header.links.map((link) => ({ ...link })),
      },
      render: ({ line1, line2, line3, links }) => {
        const lines = [line1, line2, line3].filter((line) => line.trim())
        return (
          <header className="sc-header">
            <a className="sc-wordmark" href="#/">
              {lines.map((line, index) => (
                <span key={`${line}-${index}`}>{line}</span>
              ))}
              <i className="sc-wordmark__rule" aria-hidden="true" />
            </a>
            <nav className="sc-nav" aria-label={messages.header.navAriaLabel}>
              {links.map((link) => (
                <a key={link.href + link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </header>
        )
      },
    },

    Hero: {
      label: 'Hero',
      fields: {
        brand: { type: 'text', label: 'Eyebrow (optional)' },
        headline: { type: 'textarea', label: 'Headline' },
        headlineAlign: {
          type: 'radio',
          label: 'Headline align',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ],
        },
        subcopy: { type: 'textarea', label: 'Supporting copy' },
        primaryCtaLabel: { type: 'text', label: 'Primary CTA label' },
        primaryCtaHref: { type: 'text', label: 'Primary CTA href' },
        secondaryCtaLabel: { type: 'text', label: 'Secondary CTA label' },
        secondaryCtaHref: { type: 'text', label: 'Secondary CTA href' },
        imageUrl: { type: 'text', label: 'Background image URL (optional)' },
      },
      defaultProps: {
        brand: messages.hero.brand,
        headline: messages.hero.headline,
        headlineAlign: 'right',
        subcopy: messages.hero.subcopy,
        primaryCtaLabel: messages.hero.primaryCtaLabel,
        primaryCtaHref: messages.hero.primaryCtaHref,
        secondaryCtaLabel: messages.hero.secondaryCtaLabel,
        secondaryCtaHref: messages.hero.secondaryCtaHref,
        imageUrl: '',
      },
      render: ({
        brand,
        headline,
        headlineAlign,
        subcopy,
        primaryCtaLabel,
        primaryCtaHref,
        secondaryCtaLabel,
        secondaryCtaHref,
        imageUrl,
      }) => (
        <section className={`sc-hero sc-hero--${headlineAlign}`}>
          {imageUrl ? (
            <div className="sc-hero__media" aria-hidden="true">
              <img src={imageUrl} alt="" />
            </div>
          ) : null}
          <div className="sc-hero__content">
            {brand ? <p className="sc-brand">{brand}</p> : null}
            <h1>{headline}</h1>
            {subcopy ? <p>{subcopy}</p> : null}
            {primaryCtaLabel || secondaryCtaLabel ? (
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
            ) : null}
          </div>
        </section>
      ),
    },

    Filmstrip: {
      label: 'Filmstrip',
      fields: {
        images: {
          type: 'array',
          label: 'Images',
          getItemSummary: (item) => item.alt || 'Image',
          arrayFields: {
            src: { type: 'text', label: 'Image URL' },
            alt: { type: 'text', label: 'Alt text' },
          },
          defaultItemProps: {
            src: messages.filmstrip.images[0].src,
            alt: messages.defaults.filmstripImageAlt,
          },
        },
      },
      defaultProps: {
        images: messages.filmstrip.images.map((image) => ({ ...image })),
      },
      render: ({ images }) => (
        <section className="sc-filmstrip" aria-label={messages.filmstrip.ariaLabel}>
          <div className="sc-filmstrip__track">
            {images.map((image, index) => (
              <figure key={`${image.src}-${index}`}>
                <img src={image.src} alt={image.alt} />
              </figure>
            ))}
          </div>
          {images.length > 1 ? (
            <div className="sc-filmstrip__dots" aria-hidden="true">
              {images.slice(0, 3).map((_, index) => (
                <span key={index} className={index === 1 ? 'is-active' : undefined} />
              ))}
            </div>
          ) : null}
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
        anchorId: { type: 'text', label: 'Anchor id (optional)' },
        content: { type: 'slot' },
      },
      defaultProps: {
        background: 'deep',
        width: 'default',
        padding: 'md',
        anchorId: '',
        content: [],
      },
      render: ({ background, width, padding, anchorId, content: Content }) => {
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
            id={anchorId || undefined}
            className={`sc-section${width === 'narrow' ? ' sc-section--narrow' : ''}${
              background === 'grid' ? ' sc-grid-bg' : ''
            }`}
            style={{
              background: bg,
              paddingBlock: pad,
            }}
          >
            <div className="sc-section__inner">
              <Content minEmptyHeight={120} />
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
          minEmptyHeight={120}
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
        text: messages.defaults.heading,
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
        text: messages.defaults.paragraph,
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
        src: messages.approach.imageSrc,
        alt: messages.defaults.imageAlt,
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
        label: messages.defaults.buttonLabel,
        href: messages.hero.primaryCtaHref,
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
            title: messages.defaults.newServiceTitle,
            description: messages.defaults.newServiceDescription,
            icon: 'SC',
          },
        },
      },
      defaultProps: {
        items: messages.services.items.map((item) => ({ ...item })),
      },
      render: ({ items }) => (
        <div className="sc-services">
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
        brand: messages.footer.brand,
        contact: messages.footer.contact,
        link1Label: messages.footer.links[0].label,
        link1Href: messages.footer.links[0].href,
        link2Label: messages.footer.links[1].label,
        link2Href: messages.footer.links[1].href,
        link3Label: messages.footer.links[2].label,
        link3Href: messages.footer.links[2].href,
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
  root: {
    fields: {
      title: { type: 'text', label: 'Page title' },
    },
    defaultProps: {
      title: messages.pageTitle,
    },
    render: ({ children }) => <div className="site-shell">{children}</div>,
  },
}
