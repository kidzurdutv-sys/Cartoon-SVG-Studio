import { type CountryConfig } from './countryTokens';
import { mulberry32, pick, range } from './rng';

// Parse 'stroke-width="2" stroke="#1b451d"' -> { width, color }
function parseOutline(style: string): { width: number; color: string } {
	const w = /stroke-width="([\d.]+)"/.exec(style);
	const c = /stroke="([^"]+)"/.exec(style);
	return {
		width: w ? parseFloat(w[1]) : 2,
		color: c ? c[1] : '#1a1a1a',
	};
}

const HAIR_COLORS = ['#1a1a1a', '#2d1b0e', '#4a2c14', '#5c3a21', '#3b2f2f'];
const EYE_COLORS = ['#1a1a1a', '#2d1b0e', '#4a2c14'];

export const generateCharacterRig = (
	country: CountryConfig,
	pose: string,
	seed: number,
): string => {
	const rand = mulberry32(seed);
	const { width: sw, color: sc } = parseOutline(country.outlineStyle);
	const stroke = `stroke="${sc}" stroke-width="${sw}"`;

	const isProfile = pose === 'profile';
	const is34 = pose === '3/4';
	const faceDX = isProfile ? 22 : is34 ? 10 : 0;

	// Seeded body variations
	const headRX = range(rand, 62, 78);
	const headRY = range(rand, 70, 86);
	const hairStyle = Math.floor(rand() * 6);
	const hairColor = pick(rand, HAIR_COLORS);
	const eyeStyle = Math.floor(rand() * 3);
	const eyeColor = pick(rand, EYE_COLORS);
	const eyeSize = range(rand, 11, 15);
	const browStyle = Math.floor(rand() * 2);
	const shirtStriped = rand() > 0.5;
	const skin = country.skinTone;
	const shirt = country.clothingColor1;
	const pants = country.clothingColor2;

	const cx = 200;
	const headCY = 175;

	// ---- Hair variants (drawn behind + over head) ----
	const hairBack: string[] = [];
	const hairFront: string[] = [];
	const ht = headCY - headRY; // head top
	if (hairStyle === 0) {
		// Buzz cut — simple cap arc
		hairFront.push(`<path d="M ${cx - headRX} ${headCY - 10} Q ${cx} ${ht - 25} ${cx + headRX} ${headCY - 10} L ${cx + headRX} ${headCY - 30} Q ${cx} ${ht - 45} ${cx - headRX} ${headCY - 30} Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 1) {
		// Spiky
		let spikes = '';
		for (let i = 0; i < 7; i++) {
			const x = cx - headRX + (i * (headRX * 2)) / 6;
			const h = 22 + rand() * 18;
			spikes += `L ${x + 8} ${ht - h} L ${x + 16} ${ht - 5} `;
		}
		hairFront.push(`<path d="M ${cx - headRX} ${ht + 10} ${spikes} L ${cx + headRX} ${ht + 10} Q ${cx} ${ht - 20} ${cx - headRX} ${ht + 10} Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 2) {
		// Curly puffs
		for (let i = 0; i < 8; i++) {
			const x = cx - headRX + 8 + (i * (headRX * 2 - 16)) / 7;
			const y = ht + 2 - (i % 2) * 10;
			hairBack.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="20" fill="${hairColor}" ${stroke}/>`);
		}
	} else if (hairStyle === 3) {
		// Side part sweep
		hairFront.push(`<path d="M ${cx - headRX} ${headCY - 15} Q ${cx - 10} ${ht - 30} ${cx + headRX} ${headCY - 25} L ${cx + headRX} ${headCY - 5} Q ${cx + 20} ${ht + 5} ${cx - 20} ${ht + 12} Q ${cx - headRX} ${ht + 5} ${cx - headRX} ${headCY - 15} Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 4) {
		// Top bun
		hairBack.push(`<circle cx="${cx}" cy="${ht - 22}" r="24" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M ${cx - headRX} ${headCY - 12} Q ${cx} ${ht - 22} ${cx + headRX} ${headCY - 12} L ${cx + headRX} ${headCY - 32} Q ${cx} ${ht - 42} ${cx - headRX} ${headCY - 32} Z" fill="${hairColor}" ${stroke}/>`);
	} else {
		// Long hair frame
		hairBack.push(`<path d="M ${cx - headRX - 6} ${ht} Q ${cx - headRX - 14} ${headCY + 90} ${cx - headRX + 6} ${headCY + 110} L ${cx - headRX + 26} ${headCY + 110} Q ${cx - headRX + 18} ${headCY + 40} ${cx - headRX + 10} ${ht + 12} Z" fill="${hairColor}" ${stroke}/>`);
		hairBack.push(`<path d="M ${cx + headRX + 6} ${ht} Q ${cx + headRX + 14} ${headCY + 90} ${cx + headRX - 6} ${headCY + 110} L ${cx + headRX - 26} ${headCY + 110} Q ${cx + headRX - 18} ${headCY + 40} ${cx + headRX - 10} ${ht + 12} Z" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M ${cx - headRX} ${headCY - 10} Q ${cx} ${ht - 28} ${cx + headRX} ${headCY - 10} L ${cx + headRX} ${headCY - 30} Q ${cx} ${ht - 48} ${cx - headRX} ${headCY - 30} Z" fill="${hairColor}" ${stroke}/>`);
	}

	// ---- Eyes ----
	const eyeY = headCY - 5;
	const eyeDX = 30;
	const eyeSVG = (ex: number): string => {
		if (eyeStyle === 0) {
			return `<g><circle cx="${ex}" cy="${eyeY}" r="${eyeSize}" fill="white" ${stroke}/><circle cx="${ex + 3}" cy="${eyeY + 2}" r="${eyeSize * 0.45}" fill="${eyeColor}"/><circle cx="${ex + 6}" cy="${eyeY - 2}" r="${eyeSize * 0.16}" fill="white"/></g>`;
		} else if (eyeStyle === 1) {
			return `<g><ellipse cx="${ex}" cy="${eyeY}" rx="${eyeSize * 0.8}" ry="${eyeSize * 1.15}" fill="white" ${stroke}/><circle cx="${ex + 2}" cy="${eyeY + 3}" r="${eyeSize * 0.4}" fill="${eyeColor}"/><circle cx="${ex + 5}" cy="${eyeY - 1}" r="${eyeSize * 0.15}" fill="white"/></g>`;
		}
		return `<g><circle cx="${ex}" cy="${eyeY}" r="${eyeSize * 1.25}" fill="white" ${stroke}/><circle cx="${ex + 3}" cy="${eyeY + 2}" r="${eyeSize * 0.55}" fill="${eyeColor}"/><circle cx="${ex + 7}" cy="${eyeY - 3}" r="${eyeSize * 0.2}" fill="white"/></g>`;
	};

	const eyesInner = isProfile
		? eyeSVG(cx + 12)
		: eyeSVG(cx - eyeDX) + eyeSVG(cx + eyeDX);

	// ---- Eyebrows ----
	const browY = eyeY - eyeSize - 14;
	const brow = (ex: number): string =>
		browStyle === 0
			? `<path d="M ${ex - 16} ${browY} Q ${ex} ${browY - 8} ${ex + 16} ${browY - 2}" fill="none" ${stroke} stroke-linecap="round"/>`
			: `<rect x="${ex - 15}" y="${browY - 5}" width="30" height="7" rx="3.5" fill="${hairColor}" ${stroke}/>`;
	const browsInner = isProfile ? brow(cx + 12) : brow(cx - eyeDX) + brow(cx + eyeDX);

	// ---- Nose ----
	const noseX = cx + faceDX * 0.4;
	const nose = isProfile
		? `<path d="M ${noseX + 8} ${headCY + 22} q 14 6 4 16 q -6 6 -14 2" fill="none" ${stroke} stroke-linecap="round"/>`
		: `<path d="M ${noseX} ${headCY + 18} q -6 10 2 14" fill="none" ${stroke} stroke-linecap="round"/>`;

	// ---- Ears ----
	const ears = isProfile
		? ''
		: `<circle cx="${cx - headRX}" cy="${headCY + 10}" r="14" fill="${skin}" ${stroke}/><circle cx="${cx + headRX}" cy="${headCY + 10}" r="14" fill="${skin}" ${stroke}/>`;

	// ---- Body ----
	const neckY = headCY + headRY;
	const shirtTop = neckY + 8;
	const shirtBottom = 430;
	const bodyW = 130;
	const arms = `
		<path d="M ${cx - bodyW / 2} ${shirtTop + 30} Q ${cx - bodyW / 2 - 34} ${shirtTop + 90} ${cx - bodyW / 2 - 26} ${shirtTop + 150}" fill="none" stroke="${skin}" stroke-width="26" stroke-linecap="round"/>
		<path d="M ${cx + bodyW / 2} ${shirtTop + 30} Q ${cx + bodyW / 2 + 34} ${shirtTop + 90} ${cx + bodyW / 2 + 26} ${shirtTop + 150}" fill="none" stroke="${skin}" stroke-width="26" stroke-linecap="round"/>
		<circle cx="${cx - bodyW / 2 - 26}" cy="${shirtTop + 152}" r="15" fill="${skin}" ${stroke}/>
		<circle cx="${cx + bodyW / 2 + 26}" cy="${shirtTop + 152}" r="15" fill="${skin}" ${stroke}/>`;
	const shirtFill = shirtStriped
		? `<defs><pattern id="shirtstripes" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="${shirt}"/><rect width="9" height="18" fill="${pants}" opacity="0.55"/></pattern></defs>`
		: '';
	const shirtColor = shirtStriped ? 'url(#shirtstripes)' : shirt;
	const torso = `
		<path d="M ${cx - bodyW / 2} ${shirtTop} L ${cx + bodyW / 2} ${shirtTop} L ${cx + bodyW / 2 - 12} ${shirtBottom} L ${cx - bodyW / 2 + 12} ${shirtBottom} Z" fill="${shirtColor}" ${stroke}/>
		<rect x="${cx - 16}" y="${neckY - 6}" width="32" height="26" rx="8" fill="${skin}" ${stroke}/>`;
	const legs = `
		<rect x="${cx - 52}" y="${shirtBottom - 6}" width="44" height="105" rx="14" fill="${pants}" ${stroke}/>
		<rect x="${cx + 8}" y="${shirtBottom - 6}" width="44" height="105" rx="14" fill="${pants}" ${stroke}/>
		<ellipse cx="${cx - 32}" cy="545" rx="30" ry="16" fill="#3a3a3a" ${stroke}/>
		<ellipse cx="${cx + 32}" cy="545" rx="30" ry="16" fill="#3a3a3a" ${stroke}/>`;

	const mouthY = headCY + 62;

	return `<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon character (${country.name}, ${pose} pose, seed ${seed})">
<defs>
<g id="viseme-rest"><path d="M -16 0 Q 0 7 16 0" fill="none" stroke="#5b2b2b" stroke-width="4" stroke-linecap="round"/></g>
<g id="viseme-A"><ellipse cx="0" cy="2" rx="13" ry="17" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="viseme-E"><ellipse cx="0" cy="0" rx="20" ry="7" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="viseme-O"><ellipse cx="0" cy="2" rx="12" ry="14" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="eye-blink"><path d="M -13 0 L 13 0" stroke="${sc}" stroke-width="5" stroke-linecap="round"/></g>
${shirtFill}
</defs>
${hairBack.join('\n')}
${legs}
${arms}
${torso}
${ears}
<ellipse cx="${cx}" cy="${headCY}" rx="${headRX.toFixed(0)}" ry="${headRY.toFixed(0)}" fill="${skin}" ${stroke}/>
${hairFront.join('\n')}
<g id="eyes-group" transform="translate(${faceDX},0)">${eyesInner}</g>
<g transform="translate(${faceDX},0)">${browsInner}</g>
<g transform="translate(${faceDX},0)">${nose}</g>
<g id="mouth-phonemes" transform="translate(${cx + faceDX},${mouthY})"><use href="#viseme-rest" x="0" y="0"/></g>
</svg>`;
};
