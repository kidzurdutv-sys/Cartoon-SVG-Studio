import { type CountryConfig } from './countryTokens';

export const generateEnvironmentRig = (country: CountryConfig): string => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <!-- Cinematic Gradients -->
    <linearGradient id="sky-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${country.bgColor1}" />
      <stop offset="100%" stop-color="${country.bgColor2}" />
    </linearGradient>
    <linearGradient id="mid-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${country.clothingColor1}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${country.bgColor1}" stop-opacity="0.9" />
    </linearGradient>
    <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="${country.bgColor2}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Far (Sky and distant elements) -->
  <g id="bg-layer-0" data-depth="0.1">
    <rect width="800" height="500" fill="url(#sky-grad)" />
    <!-- Distant Sun/Moon -->
    <circle cx="650" cy="150" r="80" fill="url(#sun-glow)" />
    <circle cx="650" cy="150" r="40" fill="${country.bgColor2}" />

    <!-- Distant Mountains / Structures -->
    <path d="M 0 350 L 150 200 L 300 350 L 450 250 L 600 350 L 800 200 L 800 500 L 0 500 Z" fill="${country.bgColor1}" opacity="0.6" />
  </g>

  <!-- Midground -->
  <g id="bg-layer-1" data-depth="0.5">
    <path d="M -50 500 L 100 300 L 350 450 L 500 280 L 850 480 L 850 500 Z" fill="url(#mid-grad)" />
    <!-- Midground Trees/Structures -->
    <rect x="200" y="380" width="20" height="70" fill="${country.clothingColor2}" opacity="0.8" />
    <circle cx="210" cy="350" r="40" fill="${country.clothingColor1}" opacity="0.9" />

    <rect x="600" y="320" width="30" height="130" fill="${country.clothingColor2}" opacity="0.8" />
    <path d="M 570 320 L 615 250 L 660 320 Z" fill="${country.clothingColor1}" opacity="0.9" />
  </g>

  <!-- Foreground -->
  <g id="bg-layer-2" data-depth="1.0">
    <path d="M 0 450 Q 200 400 400 450 T 800 420 L 800 500 L 0 500 Z" fill="${country.clothingColor2}" ${country.outlineStyle} />
    <!-- Foreground Elements -->
    <path d="M 50 500 L 80 400 L 110 500 Z" fill="${country.clothingColor1}" />
    <path d="M 700 500 L 740 380 L 780 500 Z" fill="${country.clothingColor1}" />
  </g>
</svg>
  `;
};
