import { type CountryConfig } from './country';
import { mulberry32, range } from '../rng';

export const generatePropRig = (
	country: CountryConfig,
	seed: number,
): string => {
	const rand = mulberry32(seed ^ 0x51ab3f);
	const main = country.propMainColor;
	const accent = country.propAccentColor;
	const variant = Math.floor(rand() * 4);
	const cx = 200;
	const cy = 210;

	let body = '';
	let label = '';
	if (variant === 0) {
		// Lantern
		const h = range(rand, 130, 170);
		body = `
		<rect x="${cx - 8}" y="${cy - h / 2 - 46}" width="16" height="26" rx="6" fill="${accent}"/>
		<path d="M ${cx - 60} ${cy - h / 2} Q ${cx} ${cy - h / 2 - 34} ${cx + 60} ${cy - h / 2}" fill="none" stroke="${accent}" stroke-width="7"/>
		<ellipse cx="${cx}" cy="${cy - h / 2}" rx="62" ry="14" fill="${accent}"/>
		<path d="M ${cx - 52} ${cy - h / 2} L ${cx - 44} ${cy + h / 2} L ${cx + 44} ${cy + h / 2} L ${cx + 52} ${cy - h / 2} Z" fill="${main}" opacity="0.92"/>
		<path d="M ${cx - 30} ${cy - h / 2} L ${cx - 24} ${cy + h / 2} L ${cx + 24} ${cy + h / 2} L ${cx + 30} ${cy - h / 2} Z" fill="#ffe9a8" opacity="0.85"/>
		<ellipse cx="${cx}" cy="${cy + h / 2}" rx="48" ry="12" fill="${accent}"/>
		<circle cx="${cx}" cy="${cy + h / 2 + 22}" r="8" fill="${accent}"/>`;
		label = 'lantern';
	} else if (variant === 1) {
		// Drum
		const w = range(rand, 150, 190);
		body = `
		<ellipse cx="${cx}" cy="${cy - 52}" rx="${w / 2}" ry="26" fill="#f5f0e6" stroke="${accent}" stroke-width="5"/>
		<path d="M ${cx - w / 2} ${cy - 52} L ${cx - w / 2 + 14} ${cy + 52} L ${cx + w / 2 - 14} ${cy + 52} L ${cx + w / 2} ${cy - 52} Z" fill="${main}"/>
		<ellipse cx="${cx}" cy="${cy + 52}" rx="${w / 2 - 14}" ry="22" fill="${accent}"/>
		<path d="M ${cx - w / 2 + 10} ${cy - 20} L ${cx + w / 2 - 10} ${cy - 20} M ${cx - w / 2 + 6} ${cy + 12} L ${cx + w / 2 - 6} ${cy + 12}" stroke="${accent}" stroke-width="6" opacity="0.6"/>
		<rect x="${cx - w / 2 - 24}" y="${cy - 120}" width="14" height="90" rx="7" fill="#8d6e4a" transform="rotate(24 ${cx - w / 2 - 17} ${cy - 75})"/>
		<circle cx="${cx - w / 2 - 44}" cy="${cy - 158}" r="12" fill="${accent}"/>`;
		label = 'drum';
	} else if (variant === 2) {
		// Vase / pot
		const h = range(rand, 150, 200);
		body = `
		<ellipse cx="${cx}" cy="${cy - h / 2}" rx="52" ry="16" fill="${accent}"/>
		<path d="M ${cx - 52} ${cy - h / 2} C ${cx - 78} ${cy - h / 4} ${cx - 70} ${cy + h / 4} ${cx - 44} ${cy + h / 2} L ${cx + 44} ${cy + h / 2} C ${cx + 70} ${cy + h / 4} ${cx + 78} ${cy - h / 4} ${cx + 52} ${cy - h / 2} Z" fill="${main}"/>
		<path d="M ${cx - 64} ${cy - 10} Q ${cx} ${cy + 6} ${cx + 64} ${cy - 10}" fill="none" stroke="${accent}" stroke-width="8" opacity="0.7"/>
		<path d="M ${cx - 58} ${cy + 34} Q ${cx} ${cy + 50} ${cx + 58} ${cy + 34}" fill="none" stroke="${accent}" stroke-width="8" opacity="0.7"/>
		<ellipse cx="${cx}" cy="${cy + h / 2}" rx="44" ry="12" fill="${accent}" opacity="0.55"/>`;
		label = 'vase';
	} else {
		// Kite
		const s = range(rand, 0.9, 1.25);
		body = `
		<g transform="translate(${cx},${cy}) scale(${s.toFixed(2)})">
		<path d="M 0 -110 L 70 0 L 0 110 L -70 0 Z" fill="${main}" stroke="${accent}" stroke-width="6"/>
		<path d="M 0 -110 L 0 110 M -70 0 L 70 0" stroke="${accent}" stroke-width="4" opacity="0.7"/>
		<path d="M -70 0 L 0 110 L 70 0" fill="none" stroke="white" stroke-width="5" opacity="0.5"/>
		<path d="M 0 110 q -12 26 -4 52 q 10 24 -6 48" fill="none" stroke="${accent}" stroke-width="5"/>
		<path d="M -4 162 l -16 10 l 14 12 Z M -8 210 l -16 10 l 14 12 Z" fill="${accent}"/>
		</g>`;
		label = 'kite';
	}

	return `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon prop (${label}, ${country.name}, seed ${seed})">
<rect width="400" height="400" fill="#0f172a" opacity="0.0"/>
${body}
<text x="200" y="372" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#94a3b8" text-transform="capitalize">${label} · ${country.name}</text>
</svg>`;
};
