import { type CountryConfig } from './countryTokens';
import { mulberry32, pick } from './rng';

// Bold 2D cartoon style — thick outlines, big round eyes, flat bright colors.
export const generateCharacterRig = (
	country: CountryConfig,
	pose: string,
	seed: number,
): string => {
	const rand = mulberry32(seed);
	const c = /stroke="([^"]+)"/.exec(country.outlineStyle);
	const sc = c ? c[1] : '#141414';
	const SW = 5.5; // bold outline
	const stroke = `stroke="${sc}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;
	const thin = `stroke="${sc}" stroke-width="3" stroke-linecap="round"`;

	const isProfile = pose === 'profile';
	const is34 = pose === '3/4';
	const faceDX = isProfile ? 24 : is34 ? 12 : 0;

	const skin = country.skinTone;
	const shirt = country.clothingColor1;
	const pants = country.clothingColor2;
	const hairColor = pick(rand, ['#141414', '#241408', '#3d2412', '#5a3a1e', '#7a2d12']);
	const hairStyle = Math.floor(rand() * 4);
	const grinOpen = rand() > 0.4;
	const shirtStriped = rand() > 0.6;

	const cx = 200;
	const headCY = 188;
	const HR = 82;

	/* ============ HAIR (chunky, bold) ============ */
	const hairBack: string[] = [];
	const hairFront: string[] = [];
	if (hairStyle === 0) {
		// Messy chunky spikes — irregular heights/widths so it reads as hair, not a crown
		const tops: Array<[number, number]> = [];
		let x = 116;
		while (x < 284) {
			const w = 20 + rand() * 14;
			const h = 62 + rand() * 38;
			tops.push([x + w / 2, h]);
			x += w;
		}
		let d = `M 112 160 `;
		for (const [tx, ty] of tops) {
			d += `L ${tx.toFixed(0)} ${ty.toFixed(0)} L ${(tx + 12 + rand() * 8).toFixed(0)} ${(108 + rand() * 14).toFixed(0)} `;
		}
		d += `L 290 160 Q 200 126 112 160 Z`;
		hairBack.push(`<path d="${d}" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 1) {
		// Neat cap with rounded fringe
		hairBack.push(`<ellipse cx="${cx}" cy="112" rx="90" ry="50" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 114 158 Q 108 66 200 60 Q 292 66 286 158 L 286 132 Q 264 110 246 132 Q 228 108 208 132 Q 188 108 170 132 Q 150 110 114 132 Z" fill="${hairColor}" ${stroke}/>`);
	} else if (hairStyle === 2) {
		// Bold curls — big puffs
		const puffs: Array<[number, number, number]> = [
			[200, 62, 30], [148, 78, 27], [252, 78, 27],
			[118, 112, 25], [282, 112, 25], [110, 150, 22], [290, 150, 22],
		];
		for (const [x, y, r] of puffs) hairBack.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 120 152 Q 118 92 200 88 Q 282 92 280 152 Q 240 126 200 130 Q 160 126 120 152 Z" fill="${hairColor}" ${stroke}/>`);
	} else {
		// Side-swept bold fringe
		hairBack.push(`<ellipse cx="${cx}" cy="110" rx="88" ry="48" fill="${hairColor}" ${stroke}/>`);
		hairFront.push(`<path d="M 114 156 Q 110 64 200 58 Q 290 64 286 156 Q 250 118 218 140 Q 190 112 160 140 Q 136 120 114 156 Z" fill="${hairColor}" ${stroke}/>`);
	}

	/* ============ FACE ============ */
	const eyeY = 178;
	const bigEye = (ex: number): string => `
		<circle cx="${ex}" cy="${eyeY}" r="23" fill="white" ${stroke}/>
		<circle cx="${ex + 3}" cy="${eyeY + 4}" r="11.5" fill="#181818"/>
		<circle cx="${ex - 2}" cy="${eyeY - 3}" r="4.2" fill="white"/>
		<circle cx="${ex + 8}" cy="${eyeY + 8}" r="2" fill="white" opacity="0.85"/>`;
	const eyesInner = isProfile ? bigEye(cx + 40) : bigEye(cx - 36) + bigEye(cx + 36);

	const brow = (ex: number): string =>
		`<path d="M ${ex - 20} 140 Q ${ex} 130 ${ex + 20} 136" fill="none" stroke="${hairColor}" stroke-width="7" stroke-linecap="round"/>`;
	const browsInner = isProfile ? brow(cx + 40) : brow(cx - 36) + brow(cx + 36);

	const nose: string = isProfile
		? `<path d="M 268 ${headCY + 8} Q 292 ${headCY + 18} 282 ${headCY + 34} Q 277 ${headCY + 41} 266 ${headCY + 38}" fill="none" ${thin}/>`
		: `<ellipse cx="${cx}" cy="${headCY + 16}" rx="9" ry="7" fill="${skin}" ${thin}/>`;

	const mouthY = headCY + 52;
	// rest mouth drawn around (0,0); #mouth-phonemes translates it into place
	const restMouth: string = isProfile
		? `<path d="M -8 0 Q 10 10 26 -2" fill="none" stroke="#7a2e2e" stroke-width="6" stroke-linecap="round"/>`
		: grinOpen
			? `<path d="M -32 -6 Q 0 30 32 -6 Q 0 6 -32 -6 Z" fill="#8e2f2f" ${thin}/><path d="M -27 -6 Q 0 3 27 -6 L 22 3 Q 0 11 -22 3 Z" fill="white" ${thin}/>`
			: `<path d="M -26 -2 Q 0 16 26 -2" fill="none" stroke="#7a2e2e" stroke-width="6" stroke-linecap="round"/>`;

	const freckles = isProfile
		? `<circle cx="${cx - 6}" cy="${headCY + 34}" r="2.6" fill="${sc}" opacity="0.55"/><circle cx="${cx + 4}" cy="${headCY + 38}" r="2.6" fill="${sc}" opacity="0.55"/>`
		: `<circle cx="${cx - 56}" cy="${headCY + 34}" r="2.6" fill="${sc}" opacity="0.55"/><circle cx="${cx - 46}" cy="${headCY + 40}" r="2.6" fill="${sc}" opacity="0.55"/><circle cx="${cx + 56}" cy="${headCY + 34}" r="2.6" fill="${sc}" opacity="0.55"/><circle cx="${cx + 46}" cy="${headCY + 40}" r="2.6" fill="${sc}" opacity="0.55"/>`;

	const ears = isProfile
		? `<circle cx="${cx - 66}" cy="${headCY + 18}" r="14" fill="${skin}" ${stroke}/>`
		: `<circle cx="${cx - HR + 4}" cy="${headCY + 16}" r="14" fill="${skin}" ${stroke}/><circle cx="${cx + HR - 4}" cy="${headCY + 16}" r="14" fill="${skin}" ${stroke}/>`;

	/* ============ BODY ============ */
	const neckY = headCY + HR; // 270
	const shirtTop = 292;
	const shirtBottom = 452;
	const bodyW = 152;

	const shirtFill = shirtStriped
		? `<pattern id="shirtstripes" width="22" height="22" patternUnits="userSpaceOnUse"><rect width="22" height="22" fill="${shirt}"/><rect width="11" height="22" fill="${pants}" opacity="0.5"/></pattern>`
		: '';
	const shirtPaint = shirtStriped ? 'url(#shirtstripes)' : shirt;

	const torsoInner = `
		<path d="M ${cx - bodyW / 2} ${shirtTop} Q ${cx} ${shirtTop - 10} ${cx + bodyW / 2} ${shirtTop} L ${cx + bodyW / 2 - 12} ${shirtBottom} Q ${cx} ${shirtBottom + 10} ${cx - bodyW / 2 + 12} ${shirtBottom} Z" fill="${shirtPaint}" ${stroke}/>
		<path d="M ${cx - 20} ${shirtTop + 2} L ${cx} ${shirtTop + 26} L ${cx + 20} ${shirtTop + 2}" fill="none" ${stroke}/>
		<rect x="${cx - 18}" y="${neckY - 10}" width="36" height="28" rx="10" fill="${skin}" ${stroke}/>`;

	const sleeveL = `<g transform="rotate(10 ${cx - 74} ${shirtTop + 36})"><rect x="${cx - 102}" y="${shirtTop + 8}" width="56" height="64" rx="18" fill="${shirtPaint}" ${stroke}/></g>`;
	const sleeveR = `<g transform="rotate(-10 ${cx + 74} ${shirtTop + 36})"><rect x="${cx + 46}" y="${shirtTop + 8}" width="56" height="64" rx="18" fill="${shirtPaint}" ${stroke}/></g>`;

	const armL = `<g id="rig-armL" data-pivot="${cx - 76},${shirtTop + 36}">
		<path d="M ${cx - 76} ${shirtTop + 64} Q ${cx - 82} ${shirtTop + 112} ${cx - 84} ${shirtTop + 146}" fill="none" stroke="${sc}" stroke-width="32" stroke-linecap="round"/>
		<path d="M ${cx - 76} ${shirtTop + 64} Q ${cx - 82} ${shirtTop + 112} ${cx - 84} ${shirtTop + 146}" fill="none" stroke="${skin}" stroke-width="22" stroke-linecap="round"/>
		<circle cx="${cx - 84}" cy="${shirtTop + 158}" r="17" fill="${skin}" ${stroke}/>
		<path d="M ${cx - 92} ${shirtTop + 156} l 0 10 M ${cx - 84} ${shirtTop + 158} l 0 11" ${thin}/></g>`;
	const armR = `<g id="rig-armR" data-pivot="${cx + 76},${shirtTop + 36}">
		<path d="M ${cx + 76} ${shirtTop + 64} Q ${cx + 82} ${shirtTop + 112} ${cx + 84} ${shirtTop + 146}" fill="none" stroke="${sc}" stroke-width="32" stroke-linecap="round"/>
		<path d="M ${cx + 76} ${shirtTop + 64} Q ${cx + 82} ${shirtTop + 112} ${cx + 84} ${shirtTop + 146}" fill="none" stroke="${skin}" stroke-width="22" stroke-linecap="round"/>
		<circle cx="${cx + 84}" cy="${shirtTop + 158}" r="17" fill="${skin}" ${stroke}/>
		<path d="M ${cx + 76} ${shirtTop + 156} l 0 10 M ${cx + 84} ${shirtTop + 158} l 0 11" ${thin}/></g>`;

	const legL = `<g id="rig-legL" data-pivot="${cx - 34},${shirtBottom}">
		<rect x="${cx - 58}" y="${shirtBottom - 4}" width="48" height="114" rx="16" fill="${pants}" ${stroke}/>
		<ellipse cx="${cx - 34}" cy="580" rx="32" ry="17" fill="#3a3a3a" ${stroke}/>
		<path d="M ${cx - 62} 580 L ${cx - 6} 580" stroke="#888" stroke-width="3.5"/></g>`;
	const legR = `<g id="rig-legR" data-pivot="${cx + 34},${shirtBottom}">
		<rect x="${cx + 10}" y="${shirtBottom - 4}" width="48" height="114" rx="16" fill="${pants}" ${stroke}/>
		<ellipse cx="${cx + 34}" cy="580" rx="32" ry="17" fill="#3a3a3a" ${stroke}/>
		<path d="M ${cx + 6} 580 L ${cx + 62} 580" stroke="#888" stroke-width="3.5"/></g>`;

	const headGroup = `<g id="rig-head" data-pivot="${cx},${neckY}">
${ears}
<circle cx="${cx}" cy="${headCY}" r="${HR}" fill="${skin}" ${stroke}/>
${hairFront.join('\n')}
${freckles}
<g id="eyes-group" transform="translate(${faceDX},0)">${eyesInner}</g>
<g transform="translate(${faceDX},0)">${browsInner}</g>
<g transform="translate(${faceDX},0)">${nose}</g>
<g id="mouth-phonemes" transform="translate(${isProfile ? cx + faceDX : cx},${mouthY})"><use href="#viseme-rest" x="0" y="0"/></g>
</g>`;

	const rigManifest = `<!-- RIG {"seed":${seed},"style":"bold2d","joints":{"head":[${cx},${headCY}],"neck":[${cx},${neckY}],"shoulderL":[${cx - 76},${shirtTop + 36}],"shoulderR":[${cx + 76},${shirtTop + 36}],"hipL":[${cx - 34},${shirtBottom}],"hipR":[${cx + 34},${shirtBottom}]},"parts":["head","torso","armL","armR","legL","legR"]} -->`;

	return `${rigManifest}
<svg viewBox="0 0 400 624" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon character (${country.name}, ${pose} pose, seed ${seed})">
<defs>
<g id="viseme-rest">${restMouth}</g>
<g id="viseme-A"><ellipse cx="0" cy="4" rx="14" ry="20" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="4"/></g>
<g id="viseme-E"><ellipse cx="0" cy="0" rx="22" ry="8" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="4"/></g>
<g id="viseme-O"><ellipse cx="0" cy="4" rx="13" ry="17" fill="#7a2e2e" stroke="#5b2b2b" stroke-width="4"/></g>
<g id="eye-blink"><path d="M -14 0 L 14 0" stroke="${sc}" stroke-width="6" stroke-linecap="round"/></g>
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
