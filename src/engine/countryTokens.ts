export interface CountryConfig {
  id: string;
  name: string;
  skinTone: string;
  clothingColor1: string;
  clothingColor2: string;
  outlineStyle: string;
  bgColor1: string;
  bgColor2: string;
  propMainColor: string;
  propAccentColor: string;
}

export const countryTokens: Record<string, CountryConfig> = {
  pakistan: {
    id: 'pakistan',
    name: 'Pakistan',
    skinTone: '#b87c4f', // South Asian warm skin tone
    clothingColor1: '#2e7d32', // Emerald green
    clothingColor2: '#f5f5f5', // Off-white
    outlineStyle: 'stroke-width="2" stroke="#1b451d"',
    bgColor1: '#004d40',
    bgColor2: '#b2dfdb',
    propMainColor: '#c5a059', // Brass/Gold
    propAccentColor: '#795548', // Wood
  },
  japan: {
    id: 'japan',
    name: 'Japan',
    skinTone: '#ffdfc4', // Fair skin tone
    clothingColor1: '#b71c1c', // Crimson red
    clothingColor2: '#212121', // Dark charcoal
    outlineStyle: 'stroke-width="3" stroke="#000000" stroke-linecap="round"', // Anime-cell style
    bgColor1: '#311b92', // Deep purple
    bgColor2: '#f48fb1', // Cherry blossom pink
    propMainColor: '#e0e0e0', // Steel
    propAccentColor: '#d32f2f', // Red accents
  },
  usa: {
    id: 'usa',
    name: 'USA',
    skinTone: '#e8b89e', // Medium light skin tone
    clothingColor1: '#1976d2', // Denim blue
    clothingColor2: '#ffffff', // White
    outlineStyle: 'stroke-width="2" stroke="#2c3e50"',
    bgColor1: '#0d47a1', // Navy
    bgColor2: '#ffc107', // Amber
    propMainColor: '#90a4ae', // Aluminum
    propAccentColor: '#37474f', // Dark grey
  },
  egypt: {
    id: 'egypt',
    name: 'Egypt',
    skinTone: '#a66a45', // Bronze skin tone
    clothingColor1: '#fbc02d', // Gold
    clothingColor2: '#ffffff', // White linen
    outlineStyle: 'stroke-width="2" stroke="#4e342e"',
    bgColor1: '#e65100', // Desert sunset orange
    bgColor2: '#ffd54f', // Sand yellow
    propMainColor: '#fbc02d', // Gold
    propAccentColor: '#00bcd4', // Turquoise
  },
  mexico: {
    id: 'mexico',
    name: 'Mexico',
    skinTone: '#c17a52', // Warm tan
    clothingColor1: '#d32f2f', // Vibrant red
    clothingColor2: '#4caf50', // Vibrant green
    outlineStyle: 'stroke-width="2" stroke="#3e2723"',
    bgColor1: '#880e4f', // Deep magenta
    bgColor2: '#ff9800', // Vibrant orange
    propMainColor: '#795548', // Terracotta
    propAccentColor: '#cddc39', // Lime
  }
};
