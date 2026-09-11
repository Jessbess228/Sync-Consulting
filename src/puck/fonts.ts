export const FONT_IDS = [
  'newsreader',
  'inter',
  'poppins',
  'montserrat',
  'georgia',
  'cormorant',
  'fraunces',
  'spectral',
  'instrument',
  'gafiya',
  'hamburg',
  'runiga',
  'moralana',
  'sellendra',
  'milker',
  'orange',
  'artisan',
  'groote',
] as const

export type FontId = (typeof FONT_IDS)[number]

const FONT_LABELS: Record<FontId, string> = {
  newsreader: 'Newsreader',
  inter: 'Inter',
  poppins: 'Poppins',
  montserrat: 'Montserrat',
  georgia: 'Georgia',
  cormorant: 'Cormorant Garamond',
  fraunces: 'Fraunces',
  spectral: 'Spectral',
  instrument: 'Instrument Sans',
  gafiya: 'Gafiya',
  hamburg: 'Hamburg Signature',
  runiga: 'Runiga',
  moralana: 'Moralana',
  sellendra: 'Sellendra',
  milker: 'Milker',
  orange: 'Orange Avenue',
  artisan: 'The Artisan',
  groote: 'Groote',
}

export const FONT_OPTIONS = FONT_IDS.map((value) => ({
  label: FONT_LABELS[value],
  value,
}))

export function fontField(label: string) {
  return {
    type: 'select' as const,
    label,
    options: FONT_OPTIONS,
  }
}

export function fontClass(font: string | undefined, fallback: FontId) {
  const id = FONT_IDS.includes(font as FontId) ? (font as FontId) : fallback
  return `sc-font-${id}`
}
