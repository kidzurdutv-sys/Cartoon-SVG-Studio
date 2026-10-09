import { type CountryConfig } from './countryTokens';
import { mulberry32, pick } from './rng';

// Parse 'stroke-width="2" stroke="#1b451d"' -> { width, color }
function parseOutline(style: string): { width: number; color: string } {
	const w = /stroke-width="([\d.]+)"/.exec(style);
	const c = /stroke="([^"]+)"/.exec(style);
	return {
		width: w ? parseFloat(w[1]) : 2.5,
		color: c ? c[1] : '#1a1a1a',
	};
}

const HAIR_COLORS = ['#1a1a1a', '#241408', '#3d2412', '#5a3a1e', '#6e4a2a'];
const EYE_COLORS = ['#201510', '#2d1b0e', '#3d2812'];

export const generateCharacterRig = (
	country: CountryConfig,
	pose: string,
	seed: number,
): string => {
	const rand = mulberry32(seed);
	const { width: sw, color: sc } = parseOutline(country.outlineStyle);
	const stroke = `stroke="${sc}" stroke-width="${sw}"`;
	const thin = `stroke="${sc}" stroke-width="${(sw * 0.7).toFixed(1)}"`;

	const isProfile = pose === 'profile';
	const is34 = pose === '3/4';
	const faceDX = isProfile ? 22 : is34 ? 10 : 0;

	const skin = country.skinTone;
	const shirt = country.clothingColor1;
	const pants = country.clothingColor2;
	const hairColor = pick(rand, HAIR_COLORS);
	const eyeColor = pick(rand, EYE_COLORS);
	const hairStyle = Math.floor(rand() * 4);
	const smileOpen = rand() > 0.45;
	const shirtStriped = rand() > 0.6;
	const hasPocket = rand() > 0.5;

	const cx = 200;
	const headCY = 180;
	const headRX = 78;
	const headRY = 88;

	/* ================= HAIR (hand-designed, always clean) ================= */
	const hairBack: string[] = [];
	const hairFront: string[] = [];
	if (hairStyle === 0) {
		// Neat side-sweep with soft bangs
		hairBack.push(`<ellipse cx="${cx}" cy="98" rx="86" ry="46" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 118 152 Q 112 62 200 56 Q 288 62 282 152 L 282 128 Q 262 104 244 124 Q 226 102 206 124 Q 186 102 168 124 Q 148 104 118 128 Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 1) {
		// Curly top — ring of puffs on an arc
		for (let i = 0; i < 9; i++) {
			const a = Math.PI - (i * Math.PI) / 8; // 180°..0°
			const x = cx + 88 * Math.cos(a);
			const y = 140 - 54 * Math.sin(a);
			const r = 23 + (i % 2) * 3;
			hairBack.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${hairColor}" ${stroke}/>`);
		}
		hairBack.push(`<circle cx="118" cy="152" r="20" fill="${hairColor}" ${stroke}/>`);
		hairBack.push(`<circle cx="282" cy="152" r="20" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 122 148 Q 118 84 200 78 Q 282 84 278 148 Q 240 118 200 122 Q 160 118 122 148 Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 2) {
		// Swept anime spikes — 3 large rounded spikes leaning right
		const lean = 14 + rand() * 10;
		const h1 = 66 + rand() * 14;
		const h2 = 78 + rand() * 14;
		const h3 = 62 + rand() * 12;
		hairBack.push(`<ellipse cx="${cx}" cy="100" rx="84" ry="44" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 120 148 L ${(150).toFixed(0)} ${(148 - h1).toFixed(0)} Q ${(158 + lean * 0.4).toFixed(0)} ${(148 - h1 + 26).toFixed(0)} ${(178).toFixed(0)} ${(112).toFixed(0)} L ${(208).toFixed(0)} ${(148 - h2).toFixed(0)} Q ${(216 + lean * 0.4).toFixed(0)} ${(148 - h2 + 28).toFixed(0)} ${(236).toFixed(0)} ${(114).toFixed(0)} L ${(262).toFixed(0)} ${(148 - h3).toFixed(0)} Q ${(268 + lean * 0.4).toFixed(0)} ${(148 - h3 + 24).toFixed(0)} ${282} ${130} L 282 148 Q 200 116 120 148 Z" fill="${hairColor}" ${stroke}/>`);
	} else {
		// Long hair with bangs — side panels + fringe tufts
		hairBack.push(`<rect x="106" y="92" width="32" height="215" rx="16" fill="${hairColor}" ${stroke}/>`);
		hairBack.push(`<rect x="262" y="92" width="32" height="215" rx="16" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 118 142 Q 112 60 200 54 Q 288 60 282 142 L 282 118 Q 200 94 118 118 Z" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<ellipse cx="160" cy="120" rx="21" ry="17" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<ellipse cx="200" cy="114" rx="22" ry="18" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<ellipse cx="240" cy="120" rx="21" ry="17" fill="${hairColor}" ${stroke}/>`);
	}

	/* ================= FACE ================= */
	const eyeY = 170;
	const eyeDX = 34;

	const bigEye = (ex: number): string => `
		<ellipse cx="${ex}" cy="${eyeY}" rx="17" ry="21" fill="white" ${stroke}/>
		<path d="M ${ex - 17} ${eyeY - 9} Q ${ex} ${eyeY - 27} ${ex + 17} ${eyeY - 9}" fill="none" ${stroke} stroke-linecap="round"/>
		<circle cx="${ex + 2}" cy="${eyeY + 3}" r="9" fill="${eyeColor}"/>
		<circle cx="${ex - 2}" cy="${eyeY - 3}" r="3.6" fill="white"/>
		<circle cx="${ex + 6}" cy="${eyeY + 6}" r="1.8" fill="white" opacity="0.9"/>`;

	const eyesInner = isProfile ? bigEye(cx + 38) : bigEye(cx - eyeDX) + bigEye(cx + eyeDX);

	const browY = 136;
	const brow = (ex: number): string =>
		`<path d="M ${ex - 19} ${browY} Q ${ex} ${browY - 9} ${ex + 19} ${browY - 3}" fill="none" stroke="${hairColor}" stroke-width="6" stroke-linecap="round"/>`;
	const browsInner = isProfile ? brow(cx + 38) : brow(cx - eyeDX) + brow(cx + eyeDX);

	const nose: string = isProfile
		? `<path d="M 266 ${headCY + 12} Q 288 ${headCY + 20} 278 ${headCY + 34} Q 274 ${headCY + 40} 264 ${headCY + 38}" fill="none" ${thin} stroke-linecap="round"/>`
		: `<path d="M ${cx - 4} ${headCY + 14} q 9 7 1 14" fill="none" ${thin} stroke-linecap="round"/>`;

	const mouthY = headCY + 48;
	// Default mouth (viseme-rest) follows the seeded smile variant.
	// NOTE: drawn around (0,0) — the #mouth-phonemes group translates it into place.
	const restMouth: string = isProfile
		? `<path d="M -6 0 Q 8 8 22 -1" fill="none" stroke="#7a2e2e" stroke-width="5" stroke-linecap="round"/>`
		: smileOpen
			? `<path d="M -26 -2 Q 0 24 26 -2 Q 0 8 -26 -2 Z" fill="#8e2f2e" ${thin}/><ellipse cx="0" cy="10" rx="10" ry="5.5" fill="#d97b7b"/>`
			: `<path d="M -24 -2 Q 0 12 24 -2" fill="none" stroke="#7a2e2e" stroke-width="5" stroke-linecap="round"/>`;

	const blush = isProfile
		? `<ellipse cx="${cx + 8}" cy="${headCY + 28}" rx="12" ry="8" fill="#ff8a8a" opacity="0.35"/>`
		: `<ellipse cx="${cx - 52}" cy="${headCY + 28}" rx="12" ry="8" fill="#ff8a8a" opacity="0.35"/><ellipse cx="${cx + 52}" cy="${headCY + 28}" rx="12" ry="8" fill="#ff8a8a" opacity="0.35"/>`;

	const ears = isProfile
		? `<circle cx="${cx - 62}" cy="${headCY + 16}" r="13" fill="${skin}" ${stroke}/><path d="M ${cx - 66} ${headCY + 12} q 6 4 2 10" fill="none" ${thin}/>`
		: `<circle cx="${cx - headRX + 2}" cy="${headCY + 14}" r="13" fill="${skin}" ${stroke}/><circle cx="${cx + headRX - 2}" cy="${headCY + 14}" r="13" fill="${skin}" ${stroke}/>`;

	/* ================= BODY ================= */
	const neckY = headCY + headRY; // 268
	const shirtTop = 288;
	const shirtBottom = 448;
	const bodyW = 148;

	const shirtFill = shirtStriped
		? `<pattern id="shirtstripes" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="${shirt}"/><rect width="10" height="20" fill="${pants}" opacity="0.5"/></pattern>`
		: '';
	const shirtPaint = shirtStriped ? 'url(#shirtstripes)' : shirt;

	const torsoInner = `
		<path d="M ${cx - bodyW / 2} ${shirtTop} Q ${cx} ${shirtTop - 8} ${cx + bodyW / 2} ${shirtTop} L ${cx + bodyW / 2 - 10} ${shirtBottom} Q ${cx} ${shirtBottom + 8} ${cx - bodyW / 2 + 10} ${shirtBottom} Z" fill="${shirtPaint}" ${stroke}/>
		<path d="M ${cx - 18} ${shirtTop + 2} L ${cx} ${shirtTop + 24} L ${cx + 18} ${shirtTop + 2}" fill="none" ${stroke} stroke-linecap="round" stroke-linejoin="round"/>
		<circle cx="${cx}" cy="${shirtTop + 62}" r="4.5" fill="${sc}"/>
		<circle cx="${cx}" cy="${shirtTop + 96}" r="4.5" fill="${sc}"/>
		${hasPocket ? `<rect x="${cx + 30}" y="${shirtTop + 66}" width="30" height="34" rx="5" fill="${pants}" opacity="0.85" ${thin}/>` : ''}
		<rect x="${cx - 17}" y="${neckY - 8}" width="34" height="26" rx="9" fill="${skin}" ${stroke}/>`;

	const sleeveL = `<g transform="rotate(10 ${cx - 72} ${shirtTop + 34})"><rect x="${cx - 98}" y="${shirtTop + 8}" width="52" height="60" rx="17" fill="${shirtPaint}" ${stroke}/></g>`;
	const sleeveR = `<g transform="rotate(-10 ${cx + 72} ${shirtTop + 34})"><rect x="${cx + 46}" y="${shirtTop + 8}" width="52" height="60" rx="17" fill="${shirtPaint}" ${stroke}/></g>`;

	const armPathL = `M ${cx - 74} ${shirtTop + 62} Q ${cx - 80} ${shirtTop + 108} ${cx - 82} ${shirtTop + 140}`;
	const armPathR = `M ${cx + 74} ${shirtTop + 62} Q ${cx + 80} ${shirtTop + 108} ${cx + 82} ${shirtTop + 140}`;
	const armL = `<g id="rig-armL" data-pivot="${cx - 74},${shirtTop + 34}">
		<path d="${armPathL}" fill="none" stroke="${sc}" stroke-width="30" stroke-linecap="round"/>
		<path d="${armPathL}" fill="none" stroke="${skin}" stroke-width="23" stroke-linecap="round"/>
		<circle cx="${cx - 82}" cy="${shirtTop + 150}" r="16" fill="${skin}" ${stroke}/>
		<path d="M ${cx - 90} ${shirtTop + 148} l 0 10 M ${cx - 82} ${shirtTop + 150} l 0 11" ${thin} stroke-linecap="round"/></g>`;
	const armR = `<g id="rig-armR" data-pivot="${cx + 74},${shirtTop + 34}">
		<path d="${armPathR}" fill="none" stroke="${sc}" stroke-width="30" stroke-linecap="round"/>
		<path d="${armPathR}" fill="none" stroke="${skin}" stroke-width="23" stroke-linecap="round"/>
		<circle cx="${cx + 82}" cy="${shirtTop + 150}" r="16" fill="${skin}" ${stroke}/>
		<path d="M ${cx + 74} ${shirtTop + 148} l 0 10 M ${cx + 82} ${shirtTop + 150} l 0 11" ${thin} stroke-linecap="round"/></g>`;

	const legL = `<g id="rig-legL" data-pivot="${cx - 32},${shirtBottom}">
		<rect x="${cx - 56}" y="${shirtBottom - 4}" width="46" height="112" rx="15" fill="${pants}" ${stroke}/>
		<ellipse cx="${cx - 33}" cy="576" rx="30" ry="16" fill="#3a3a3a" ${stroke}/>
		<path d="M ${cx - 59} 576 L ${cx - 7} 576" stroke="#777" stroke-width="3"/></g>`;
	const legR = `<g id="rig-legR" data-pivot="${cx + 32},${shirtBottom}">
		<rect x="${cx + 10}" y="${shirtBottom - 4}" width="46" height="112" rx="15" fill="${pants}" ${stroke}/>
		<ellipse cx="${cx + 33}" cy="576" rx="30" ry="16" fill="#3a3a3a" ${stroke}/>
		<path d="M ${cx + 7} 576 L ${cx + 59} 576" stroke="#777" stroke-width="3"/></g>`;

	const headGroup = `<g id="rig-head" data-pivot="${cx},${neckY}">
${ears}
<ellipse cx="${cx}" cy="${headCY}" rx="${headRX}" ry="${headRY}" fill="${skin}" ${stroke}/>
${hairFront.join('\n')}
${blush}
<g id="eyes-group" transform="translate(${faceDX},0)">${eyesInner}</g>
<g transform="translate(${faceDX},0)">${browsInner}</g>
<g transform="translate(${faceDX},0)">${nose}</g>
<g id="mouth-phonemes" transform="translate(${isProfile ? cx + faceDX : cx},${mouthY})"><use href="#viseme-rest" x="0" y="0"/></g>
</g>`;

	const rigManifest = `<!-- RIG {"seed":${seed},"joints":{"head":[${cx},${headCY}],"neck":[${cx},${neckY}],"shoulderL":[${cx - 74},${shirtTop + 34}],"shoulderR":[${cx + 74},${shirtTop + 34}],"hipL":[${cx - 32},${shirtBottom}],"hipR":[${cx + 32},${shirtBottom}]},"parts":["head","torso","armL","armR","legL","legR"]} -->`;

	return `${rigManifest}
<svg viewBox="0 0 400 620" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon character (${country.name}, ${pose} pose, seed ${seed})">
<defs>
<g id="viseme-rest">${restMouth}</g>
<g id="viseme-A"><ellipse cx="0" cy="2" rx="13" ry="17" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="viseme-E"><ellipse cx="0" cy="0" rx="20" ry="7" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="viseme-O"><ellipse cx="0" cy="2" rx="12" ry="14" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="3"/></g>
<g id="eye-blink"><path d="M -13 0 L 13 0" stroke="${sc}" stroke-width="5" stroke-linecap="round"/></g>
${shirtFill}
</defs>
${hairBack.join('\n')}
${legL}
${legR}
${sleeveL}
${sleeveR}
${armL}
${armR}
<g id="rig-torso">${torsoInner}</g>
${headGroup}
</svg>`;
};
