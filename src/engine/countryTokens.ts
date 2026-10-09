import { type StyleToken } from '../types';

export const STYLE_PRESETS: StyleToken[] = [
  {
    id: 'western',
    name: 'Western Cartoon',
    description: 'Thick lines, bold colors, round features (Disney/Pixar style)',
    colorPalette: ['#1A1A1A', '#FF4B4B', '#4B8BFF', '#FFD166', '#06D6A0'],
    lineStyle: 'thick',
    featureStyle: 'round',
    promptModifier: 'in a 2D Western cartoon style, thick outlines, bold colors, round features, like classic Disney or early Pixar concepts, flat vector shading'
  },
  {
    id: 'japanese',
    name: 'Anime / Manga',
    description: 'Thin lines, pastel colors, large eyes (Japanese anime style)',
    colorPalette: ['#2C3E50', '#FF9F43', '#EE5A24', '#0abde3', '#10ac84'],
    lineStyle: 'thin',
    featureStyle: 'sharp',
    promptModifier: 'in a modern Japanese anime style, very thin sharp linework, pastel bright colors, large expressive anime eyes, studio ghibli inspired vectors'
  },
  {
    id: 'south-asian',
    name: 'South Asian',
    description: 'Medium lines, warm colors, detailed patterns (Indian animation style)',
    colorPalette: ['#3E2723', '#E65100', '#FBC02D', '#1B5E20', '#B71C1C'],
    lineStyle: 'thin',
    featureStyle: 'round',
    promptModifier: 'in a South Asian animation style, warm earthy vibrant colors, intricate patterns, stylized cultural attire, medium linework'
  },
  {
    id: 'european',
    name: 'European Graphic',
    description: 'Thin lines, muted colors, angular features (European cartoon style)',
    colorPalette: ['#2D3436', '#D63031', '#0984E3', '#FDCB6E', '#00B894'],
    lineStyle: 'thin',
    featureStyle: 'angular',
    promptModifier: 'in a classic European graphic novel style, angular features, moody muted colors, thin precise linework, tin-tin or moebius inspired vectors'
  },
  {
    id: 'pixel',
    name: '8-Bit Retro',
    description: 'No lines, blocky shapes, limited palette (8-bit style)',
    colorPalette: ['#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
    lineStyle: 'none',
    featureStyle: 'angular',
    promptModifier: 'in an 8-bit retro pixel art vector style, blocky rigid square shapes, extremely limited color palette, no outlines, classic arcade look'
  },
  {
    id: 'sketch',
    name: 'Pencil Sketch',
    description: 'Rough lines, pencil-like, monochrome (hand-drawn style)',
    colorPalette: ['#111111', '#333333', '#666666', '#999999', '#CCCCCC'],
    lineStyle: 'thick',
    featureStyle: 'sharp',
    promptModifier: 'in a rough monochrome pencil sketch style, messy overlapping lines, grayscale only, hand-drawn aesthetic vector shapes'
  }
];

export const getStylePromptModifier = (styleId: string): string => {
  const style = STYLE_PRESETS.find(s => s.id === styleId);
  return style ? style.promptModifier : STYLE_PRESETS[0].promptModifier;
};

export const getStyleById = (id: string): StyleToken | undefined => {
  return STYLE_PRESETS.find(s => s.id === id);
};
