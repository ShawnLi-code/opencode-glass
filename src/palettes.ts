export const PALETTE_IDS = ['blue', 'graphite', 'jade', 'violet', 'ice', 'amber'] as const
export type PaletteId = typeof PALETTE_IDS[number]
export type RGB = readonly [number, number, number]
export interface GlassPalette {
  id: PaletteId
  base: string
  accent: RGB
  second: RGB
  ink: string
  lightInk: string
  colors: readonly RGB[]
}

/** Approved preview colors. Semantic success/error/warning colors stay independent. */
export const PALETTES: readonly GlassPalette[] = [
  { id: 'blue', base: '#05070e', accent: [77,107,254], second: [112,192,255], ink: '#a5b7ff', lightInk: '#3c53ab',
    colors: [[77,107,254],[112,192,255],[140,110,255],[40,200,190]] },
  { id: 'graphite', base: '#101318', accent: [150,167,188], second: [117,138,158], ink: '#c4cfdc', lightInk: '#47576b',
    colors: [[150,167,188],[117,138,158],[138,148,164],[113,138,145]] },
  { id: 'jade', base: '#071310', accent: [55,141,115], second: [84,143,139], ink: '#9acfb9', lightInk: '#28694f',
    colors: [[55,141,115],[84,143,139],[73,123,99],[69,141,127]] },
  { id: 'violet', base: '#100d18', accent: [130,97,176], second: [108,122,170], ink: '#c5aedf', lightInk: '#6a438d',
    colors: [[130,97,176],[108,122,170],[153,113,161],[115,107,152]] },
  { id: 'ice', base: '#071216', accent: [62,139,160], second: [92,133,164], ink: '#9ecbd6', lightInk: '#2c6376',
    colors: [[62,139,160],[92,133,164],[76,142,150],[100,151,168]] },
  { id: 'amber', base: '#16110d', accent: [155,111,67], second: [135,124,103], ink: '#d7bb94', lightInk: '#805524',
    colors: [[155,111,67],[135,124,103],[159,128,84],[143,115,95]] },
]

export function getPalette(id?: string): GlassPalette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}
const opacity = (alpha: number) => String(alpha).replace(/^0\./, '.')
export const rgba = (rgb: RGB, alpha: number) => `rgba(${rgb.join(',')},${opacity(alpha)})`
export function baseRGBA(hex: string, alpha: number) {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${opacity(alpha)})`
}
