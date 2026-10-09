import { type CountryConfig } from './countryTokens';

export const generateCharacterRig = (country: CountryConfig, pose: string): string => {
  // Simple offset based on pose to illustrate flexibility
  const isProfile = pose === 'profile';
  const is34 = pose === '3/4';

  const faceOffsetX = isProfile ? 20 : (is34 ? 10 : 0);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 800" width="100%" height="100%">
  <defs>
    <!-- Lip-Sync Visemes Definitions -->
    <g id="viseme-rest">
      <path d="M -15 0 Q 0 5 15 0" stroke="#333" stroke-width="3" fill="none" />
    </g>
    <g id="viseme-A">
      <path d="M -15 0 Q 0 20 15 0 Q 0 25 -15 0" fill="#222" />
    </g>
    <g id="viseme-E">
      <path d="M -20 -2 Q 0 2 20 -2 Q 0 8 -20 -2" fill="#222" />
      <path d="M -15 -2 L 15 -2" stroke="#fff" stroke-width="2" />
    </g>
    <g id="viseme-O">
      <circle cx="0" cy="5" r="8" fill="#222" />
    </g>

    <!-- Eyes Definitions -->
    <g id="eye-open">
      <circle cx="0" cy="0" r="10" fill="#fff" />
      <circle cx="0" cy="0" r="4" fill="#333" />
    </g>
    <g id="eye-half">
      <path d="M -10 0 A 10 10 0 0 1 10 0 Z" fill="#fff" />
      <circle cx="0" cy="0" r="4" fill="#333" clip-path="url(#half-lid-clip)" />
    </g>
    <g id="eye-blink">
      <path d="M -10 0 L 10 0" stroke="#333" stroke-width="3" fill="none" />
    </g>
  </defs>

  <g id="root" data-joint="hip" transform="translate(250, 450)" data-transform-origin="250 450">

    <!-- Legs (simplified for rig structure) -->
    <g id="left-leg" data-joint="left-hip" transform="translate(-30, 100)" data-transform-origin="220 550">
      <rect x="-15" y="0" width="30" height="150" fill="${country.clothingColor2}" rx="5" ${country.outlineStyle} />
    </g>
    <g id="right-leg" data-joint="right-hip" transform="translate(30, 100)" data-transform-origin="280 550">
      <rect x="-15" y="0" width="30" height="150" fill="${country.clothingColor2}" rx="5" ${country.outlineStyle} />
    </g>

    <!-- Torso -->
    <g id="torso" data-joint="chest" transform="translate(0, -100)" data-transform-origin="250 350">
      <path d="M -50 -100 L 50 -100 L 40 100 L -40 100 Z" fill="${country.clothingColor1}" ${country.outlineStyle} />

      <!-- Left Arm Chain -->
      <g id="left-arm" data-joint="left-shoulder" transform="translate(-55, -80)" data-transform-origin="195 270">
        <rect x="-20" y="0" width="40" height="100" fill="${country.clothingColor1}" rx="10" ${country.outlineStyle} />
        <g id="left-forearm" data-joint="left-elbow" transform="translate(0, 90)" data-transform-origin="195 360">
          <rect x="-15" y="0" width="30" height="90" fill="${country.skinTone}" rx="15" ${country.outlineStyle} />
          <g id="left-hand" data-joint="left-wrist" transform="translate(0, 80)" data-transform-origin="195 440">
            <circle cx="0" cy="15" r="20" fill="${country.skinTone}" ${country.outlineStyle} />
          </g>
        </g>
      </g>

      <!-- Right Arm Chain -->
      <g id="right-arm" data-joint="right-shoulder" transform="translate(55, -80)" data-transform-origin="305 270">
        <rect x="-20" y="0" width="40" height="100" fill="${country.clothingColor1}" rx="10" ${country.outlineStyle} />
        <g id="right-forearm" data-joint="right-elbow" transform="translate(0, 90)" data-transform-origin="305 360">
          <rect x="-15" y="0" width="30" height="90" fill="${country.skinTone}" rx="15" ${country.outlineStyle} />
          <g id="right-hand" data-joint="right-wrist" transform="translate(0, 80)" data-transform-origin="305 440">
            <circle cx="0" cy="15" r="20" fill="${country.skinTone}" ${country.outlineStyle} />
          </g>
        </g>
      </g>

      <!-- Neck and Head -->
      <g id="neck" data-joint="neck" transform="translate(0, -100)" data-transform-origin="250 250">
        <rect x="-15" y="-30" width="30" height="40" fill="${country.skinTone}" ${country.outlineStyle} />

        <g id="head" data-joint="head-base" transform="translate(0, -60)" data-transform-origin="250 190">
          <circle cx="0" cy="0" r="70" fill="${country.skinTone}" ${country.outlineStyle} />

          <!-- Facial Features Group offset by pose -->
          <g id="face" transform="translate(${faceOffsetX}, 0)">
            <!-- Eyes Group -->
            <g id="eyes-group" transform="translate(0, -10)">
              <use href="#eye-open" x="-25" y="0" />
              <use href="#eye-open" x="${isProfile ? -25 : 25}" y="0" opacity="${isProfile ? 0 : 1}" />
            </g>

            <!-- Mouth Phonemes Group -->
            <g id="mouth-phonemes" transform="translate(0, 30)">
              <!-- Render default rest state, others can be toggled via JS/CSS -->
              <use href="#viseme-rest" x="0" y="0" />
            </g>
          </g>

        </g>
      </g>
    </g>
  </g>
</svg>
  `;
};
