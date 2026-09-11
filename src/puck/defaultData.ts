import type { Data } from '@puckeditor/core'
import { messages } from '../pages/Home.messages'

export const defaultData: Data = {
  root: {
    props: {
      title: messages.pageTitle,
    },
  },
  content: [
    {
      type: 'Header',
      props: {
        id: 'Header-1',
        line1: messages.header.line1,
        line2: messages.header.line2,
        line3: messages.header.line3,
        links: messages.header.links.map((link) => ({ ...link })),
      },
    },
    {
      type: 'Hero',
      props: {
        id: 'Hero-1',
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
    },
    {
      type: 'Filmstrip',
      props: {
        id: 'Filmstrip-1',
        images: messages.filmstrip.images.map((image) => ({ ...image })),
      },
    },
    {
      type: 'Section',
      props: {
        id: 'Section-services',
        background: 'grid',
        width: 'default',
        padding: 'lg',
        anchorId: 'services',
        content: [
          {
            type: 'Heading',
            props: {
              id: 'Heading-services',
              text: messages.services.heading,
              level: 'h2',
              align: 'left',
            },
          },
          {
            type: 'Spacer',
            props: {
              id: 'Spacer-1',
              size: 20,
            },
          },
          {
            type: 'Text',
            props: {
              id: 'Text-services-intro',
              text: messages.services.intro,
              align: 'left',
            },
          },
          {
            type: 'Spacer',
            props: {
              id: 'Spacer-2',
              size: 28,
            },
          },
          {
            type: 'Services',
            props: {
              id: 'Services-1',
              items: messages.services.items.map((item) => ({ ...item })),
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
        anchorId: 'approach',
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
                    text: messages.approach.heading,
                    level: 'h2',
                    align: 'left',
                  },
                },
                {
                  type: 'Text',
                  props: {
                    id: 'Text-approach',
                    text: messages.approach.body,
                    align: 'left',
                  },
                },
                {
                  type: 'Spacer',
                  props: {
                    id: 'Spacer-3',
                    size: 16,
                  },
                },
                {
                  type: 'Button',
                  props: {
                    id: 'Button-approach',
                    label: messages.approach.ctaLabel,
                    href: messages.approach.ctaHref,
                    variant: 'primary',
                  },
                },
                {
                  type: 'Image',
                  props: {
                    id: 'Image-approach',
                    src: messages.approach.imageSrc,
                    alt: messages.approach.imageAlt,
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
        anchorId: 'contact',
        content: [
          {
            type: 'Heading',
            props: {
              id: 'Heading-contact',
              text: messages.contact.heading,
              level: 'h2',
              align: 'center',
            },
          },
          {
            type: 'Text',
            props: {
              id: 'Text-contact',
              text: messages.contact.body,
              align: 'center',
            },
          },
          {
            type: 'Spacer',
            props: {
              id: 'Spacer-4',
              size: 20,
            },
          },
          {
            type: 'Button',
            props: {
              id: 'Button-contact',
              label: messages.contact.ctaLabel,
              href: `mailto:${messages.contact.email}`,
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
        brand: messages.footer.brand,
        contact: messages.footer.contact,
        link1Label: messages.footer.links[0].label,
        link1Href: messages.footer.links[0].href,
        link2Label: messages.footer.links[1].label,
        link2Href: messages.footer.links[1].href,
        link3Label: messages.footer.links[2].label,
        link3Href: messages.footer.links[2].href,
      },
    },
  ],
}
