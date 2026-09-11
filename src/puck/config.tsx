import type { Config, Slot } from '@puckeditor/core'
import { Filmstrip } from './Filmstrip'
import { fluidPx } from './fluidPx'
import { SiteLink } from '../lib/SiteLink'

export type SyncComponents = {
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
    height: number
  }
  Section: {
    background: 'deep' | 'panel' | 'grid'
    width: 'default' | 'narrow'
    padding: 'sm' | 'md' | 'lg'
    paddingLeft: number
    paddingRight: number
    anchorId: string
    content: Slot
  }
  Columns: {
    columns: '2' | '3'
    gap: number
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
    leftAlign: 'left' | 'center' | 'right'
    rightAlign: 'left' | 'center' | 'right'
    thirdAlign: 'left' | 'center' | 'right'
    left: Slot
    right: Slot
    third: Slot
  }
  Heading: {
    text: string
    level: 'h1' | 'h2' | 'h3'
    align: 'left' | 'center' | 'right'
  }
  Text: {
    text: string
    align: 'left' | 'center' | 'right'
  }
  Image: {
    src: string
    alt: string
    width: number
    align: 'left' | 'center' | 'right'
  }
  Button: {
    label: string
    href: string
    variant: 'primary' | 'ghost'
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

const columnAlignField = {
  type: 'radio' as const,
  options: [
    { label: 'Left', value: 'left' },
    { label: 'Middle', value: 'center' },
    { label: 'Right', value: 'right' },
  ],
}

export const puckConfig: Config<SyncComponents, RootProps> = {
  categories: {
    layout: {
      title: 'Layout',
      components: ['Section', 'Columns', 'Spacer', 'Divider'],
    },
    content: {
      title: 'Content',
      components: ['Header', 'Hero', 'Filmstrip', 'Heading', 'Text', 'Image', 'Button', 'Footer'],
    },
  },
  components: {
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
            label: 'Page',
            href: '#',
          },
        },
      },
      defaultProps: {
        line1: 'Brand',
        line2: '',
        line3: '',
        links: [{ label: 'Page', href: '#' }],
      },
      render: ({ line1, line2, line3, links, puck }) => {
        const lines = [line1, line2, line3].filter((line) => line.trim())
        return (
          <header className="sc-header">
            <a
              className="sc-wordmark"
              href="#/"
              onClick={puck.isEditing ? (event) => event.preventDefault() : undefined}
            >
              {lines.map((line, index) => (
                <span key={`${line}-${index}`}>{line}</span>
              ))}
              <i className="sc-wordmark__rule" aria-hidden="true" />
            </a>
            <nav className="sc-nav" aria-label="Primary">
              {links.map((link) => (
                <SiteLink key={link.href + link.label} href={link.href} editing={puck.isEditing}>
                  {link.label}
                </SiteLink>
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
        brand: '',
        headline: 'Headline',
        headlineAlign: 'right',
        subcopy: '',
        primaryCtaLabel: '',
        primaryCtaHref: '#',
        secondaryCtaLabel: '',
        secondaryCtaHref: '#',
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
        puck,
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
                  <SiteLink className="sc-btn sc-btn--primary" href={primaryCtaHref} editing={puck.isEditing}>
                    {primaryCtaLabel}
                  </SiteLink>
                ) : null}
                {secondaryCtaLabel ? (
                  <SiteLink className="sc-btn sc-btn--ghost" href={secondaryCtaHref} editing={puck.isEditing}>
                    {secondaryCtaLabel}
                  </SiteLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ),
    },

    Filmstrip: {
      label: 'Photo row',
      fields: {
        height: { type: 'number', label: 'Height (px)', min: 80, max: 800 },
        images: {
          type: 'array',
          label: 'Images',
          getItemSummary: (item) => item.alt || 'Image',
          arrayFields: {
            src: { type: 'text', label: 'Image URL' },
            alt: { type: 'text', label: 'Alt text' },
          },
          defaultItemProps: {
            src: '',
            alt: 'Image',
          },
        },
      },
      defaultProps: {
        height: 320,
        images: [
          { src: '', alt: 'Photo 1' },
          { src: '', alt: 'Photo 2' },
          { src: '', alt: 'Photo 3' },
          { src: '', alt: 'Photo 4' },
          { src: '', alt: 'Photo 5' },
          { src: '', alt: 'Photo 6' },
        ],
      },
      render: ({ images, height }) => <Filmstrip images={images} height={height} />,
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
            { label: 'Full', value: 'default' },
            { label: 'Narrow', value: 'narrow' },
          ],
        },
        padding: {
          type: 'select',
          label: 'Padding top / bottom',
          options: [
            { label: 'Small', value: 'sm' },
            { label: 'Medium', value: 'md' },
            { label: 'Large', value: 'lg' },
          ],
        },
        paddingLeft: { type: 'number', label: 'Padding left (px)', min: 0, max: 400 },
        paddingRight: { type: 'number', label: 'Padding right (px)', min: 0, max: 400 },
        anchorId: { type: 'text', label: 'Anchor id (optional)' },
        content: { type: 'slot' },
      },
      defaultProps: {
        background: 'deep',
        width: 'default',
        padding: 'md',
        paddingLeft: 0,
        paddingRight: 0,
        anchorId: '',
        content: [],
      },
      render: ({ background, width, padding, paddingLeft, paddingRight, anchorId, content: Content }) => {
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
              paddingLeft: fluidPx(paddingLeft),
              paddingRight: fluidPx(paddingRight),
            }}
          >
            <div className="sc-section__inner">
              <Content minEmptyHeight={48} />
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
        gap: { type: 'number', label: 'Gap (px)', min: 0, max: 120 },
        paddingTop: { type: 'number', label: 'Padding top (px)', min: 0, max: 400 },
        paddingRight: { type: 'number', label: 'Padding right (px)', min: 0, max: 400 },
        paddingBottom: { type: 'number', label: 'Padding bottom (px)', min: 0, max: 400 },
        paddingLeft: { type: 'number', label: 'Padding left (px)', min: 0, max: 400 },
        leftAlign: { ...columnAlignField, label: 'Left column' },
        rightAlign: { ...columnAlignField, label: 'Right column' },
        thirdAlign: { ...columnAlignField, label: 'Third column' },
        left: { type: 'slot' },
        right: { type: 'slot' },
        third: { type: 'slot' },
      },
      defaultProps: {
        columns: '2',
        gap: 24,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        leftAlign: 'left',
        rightAlign: 'left',
        thirdAlign: 'left',
        left: [],
        right: [],
        third: [],
      },
      render: ({
        columns,
        gap,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        leftAlign,
        rightAlign,
        thirdAlign,
        left: Left,
        right: Right,
        third: Third,
      }) => (
        <div
          className={`sc-columns sc-columns--${columns}`}
          style={{
            gap: gap || 0,
            paddingTop: fluidPx(paddingTop),
            paddingRight: fluidPx(paddingRight),
            paddingBottom: fluidPx(paddingBottom),
            paddingLeft: fluidPx(paddingLeft),
          }}
        >
          <Left className={`sc-column sc-column--${leftAlign || 'left'}`} minEmptyHeight={48} />
          <Right className={`sc-column sc-column--${rightAlign || 'left'}`} minEmptyHeight={48} />
          {columns === '3' ? (
            <Third className={`sc-column sc-column--${thirdAlign || 'left'}`} minEmptyHeight={48} />
          ) : null}
        </div>
      ),
    },

    Heading: {
      label: 'Heading',
      inline: true,
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
            { label: 'Right', value: 'right' },
          ],
        },
      },
      defaultProps: {
        text: 'Heading',
        level: 'h2',
        align: 'left',
      },
      render: ({ text, level, align, puck }) => {
        const Tag = level
        return (
          <div ref={puck.dragRef} className="sc-drag-target">
            <Tag className={`sc-heading sc-heading--${level} sc-align-${align}`}>{text}</Tag>
          </div>
        )
      },
    },

    Text: {
      label: 'Text',
      inline: true,
      fields: {
        text: { type: 'textarea', label: 'Text' },
        align: {
          type: 'radio',
          label: 'Align',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      },
      defaultProps: {
        text: 'Supporting paragraph goes here.',
        align: 'left',
      },
      render: ({ text, align, puck }) => (
        <p ref={puck.dragRef} className={`sc-text sc-align-${align}`}>
          {text}
        </p>
      ),
    },

    Image: {
      label: 'Image',
      inline: true,
      fields: {
        src: { type: 'text', label: 'Image URL' },
        alt: { type: 'text', label: 'Alt text' },
        width: { type: 'number', label: 'Width (%)', min: 10, max: 100 },
        align: {
          type: 'radio',
          label: 'Align',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
        },
      },
      defaultProps: {
        src: '',
        alt: 'Image',
        width: 100,
        align: 'left',
      },
      render: ({ src, alt, width, align, puck }) => (
        <figure
          ref={puck.dragRef}
          className={`sc-image sc-image--${align || 'left'}`}
          style={{ width: `${Math.min(100, Math.max(10, width || 100))}%` }}
        >
          {src ? <img src={src} alt={alt} /> : <div className="sc-image__placeholder">Image</div>}
        </figure>
      ),
    },

    Button: {
      label: 'Button / CTA',
      inline: true,
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
        href: '#',
        variant: 'primary',
      },
      render: ({ label, href, variant, puck }) => (
        <div ref={puck.dragRef} className="sc-btn-row">
          <SiteLink
            className={`sc-btn sc-btn--${variant === 'ghost' ? 'ghost' : 'primary'}`}
            href={href}
            editing={puck.isEditing}
          >
            {label}
          </SiteLink>
        </div>
      ),
    },

    Spacer: {
      label: 'Spacer',
      inline: true,
      fields: {
        size: { type: 'number', label: 'Height (px)', min: 8, max: 240 },
      },
      defaultProps: {
        size: 32,
      },
      render: ({ size, puck }) => (
        <div ref={puck.dragRef} className="sc-spacer" style={{ height: size }} aria-hidden="true" />
      ),
    },

    Divider: {
      label: 'Divider',
      inline: true,
      fields: {},
      defaultProps: {},
      render: ({ puck }) => <hr ref={puck.dragRef} className="sc-divider" />,
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
        brand: 'Brand',
        contact: '',
        link1Label: 'Link',
        link1Href: '#',
        link2Label: '',
        link2Href: '#',
        link3Label: '',
        link3Href: '#',
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
        puck,
      }) => {
        const links = [
          { label: link1Label, href: link1Href },
          { label: link2Label, href: link2Href },
          { label: link3Label, href: link3Href },
        ].filter((link) => link.label)
        return (
          <footer className="sc-footer">
            <div className="sc-footer__inner">
              <div>
                <p className="sc-footer__brand">{brand}</p>
                <p className="sc-footer__meta">{contact}</p>
              </div>
              <ul className="sc-footer__links">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <SiteLink href={link.href} editing={puck.isEditing}>
                      {link.label}
                    </SiteLink>
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
      title: 'Page',
    },
    render: ({ children }) => <div className="site-shell">{children}</div>,
  },
}
