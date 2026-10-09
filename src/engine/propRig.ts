import { type CountryConfig } from './countryTokens';

export const generatePropRig = (country: CountryConfig): string => {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Specular Highlight -->
    <linearGradient id="specular" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#fff" stop-opacity="0.1" />
      <stop offset="100%" stop-color="#fff" stop-opacity="0" />
    </linearGradient>

    <!-- Ambient Shadow -->
    <linearGradient id="shadow" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#000" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#000" stop-opacity="0" />
    </linearGradient>
  </defs>

  <g id="prop-root" transform="translate(200, 200)">
    <!-- Base Shadow -->
    <ellipse cx="0" cy="150" rx="100" ry="20" fill="#000" opacity="0.3" />

    <!-- Main Prop Body (A stylized cultural artifact / vase / shield) -->
    <g id="prop-body">
      <!-- Ambient Shadow Layer -->
      <path d="M -80 100 C -120 0, -60 -100, 0 -120 C 60 -100, 120 0, 80 100 Z" fill="${country.propMainColor}" ${country.outlineStyle} />
      <path d="M -80 100 C -120 0, -60 -100, 0 -120 C 60 -100, 120 0, 80 100 Z" fill="url(#shadow)" />

      <!-- Cultural Accent Details -->
      <path d="M -50 0 Q 0 50 50 0 Q 0 -50 -50 0 Z" fill="${country.propAccentColor}" />
      <circle cx="0" cy="-60" r="15" fill="${country.propAccentColor}" />
      <circle cx="0" cy="60" r="15" fill="${country.propAccentColor}" />

      <!-- Specular Highlight Layer -->
      <path d="M -60 80 C -90 0, -40 -80, 0 -100 C 10 -100, 0 -80, -30 0 C -50 60, -40 80, -60 80 Z" fill="url(#specular)" />
    </g>
  </g>
</svg>
  `;
};
