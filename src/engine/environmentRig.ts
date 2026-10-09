import { type CountryConfig } from './countryTokens';
import { mulberry32, range } from './rng';

export const generateEnvironmentRig = (
	country: CountryConfig,
	seed: number,
): string => {
	const rand = mulberry32(seed ^ 0x9e3779b9);
	const sky1 = country.bgColor1;
	const sky2 = country.bgColor2;

	// Seeded clouds
	let clouds = '';
	const nClouds = 3 + Math.floor(rand() * 3);
	for (let i = 0; i < nClouds; i++) {
		const x = range(rand, 60, 740);
		const y = range(rand, 50, 200);
		const s = range(rand, 0.7, 1.4);
		clouds += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(2)})" fill="white" opacity="0.85">
			<ellipse cx="0" cy="0" rx="42" ry="22"/><ellipse cx="30" cy="-10" rx="32" ry="20"/><ellipse cx="-30" cy="-8" rx="30" ry="18"/>
		</g>`;
	}

	// Seeded hills + trees
	let hills = '';
	let trees = '';
	const hillColors = ['#3d8b4f', '#2f7a44', '#357a3d'];
	for (let i = 0; i < 3; i++) {
		const hx = 100 + i * 260 + range(rand, -40, 40);
		const hr = range(rand, 180, 260);
		hills += `<circle cx="${hx.toFixed(0)}" cy="640" r="${hr.toFixed(0)}" fill="${hillColors[i % 3]}"/>`;
	}
	const nTrees = 4 + Math.floor(rand() * 3);
	for (let i = 0; i < nTrees; i++) {
		const x = range(rand, 50, 750);
		const y = range(rand, 420, 500);
		const s = range(rand, 0.8, 1.5);
		trees += `<g transform="translate(${x.toFixed(0)},${y.toFixed(0)}) scale(${s.toFixed(2)})">
			<rect x="-7" y="0" width="14" height="44" fill="#6d4c2f"/>
			<circle cx="0" cy="-18" r="30" fill="#2e7d32"/>
			<circle cx="-18" cy="-6" r="20" fill="#388e3c"/>
			<circle cx="18" cy="-6" r="20" fill="#1b5e20"/>
		</g>`;
	}

	// Birds
	let birds = '';
	for (let i = 0; i < 3; i++) {
		const x = range(rand, 150, 650);
		const y = range(rand, 90, 180);
		birds += `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} q 10 -10 20 0 q 10 -10 20 0" fill="none" stroke="#333" stroke-width="3" stroke-linecap="round"/>`;
	}

	// Sun tinted by country palette
	const sunX = range(rand, 620, 720);
	const sunY = range(rand, 70, 130);

	return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cartoon environment (${country.name}, seed ${seed})">
<defs>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="${sky2}"/><stop offset="1" stop-color="${sky1}"/>
</linearGradient>
</defs>
<rect width="800" height="600" fill="url(#sky)"/>
<circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="46" fill="#ffdf5e" opacity="0.9"/>
<circle cx="${sunX.toFixed(0)}" cy="${sunY.toFixed(0)}" r="62" fill="#ffdf5e" opacity="0.25"/>
${clouds}
${birds}
${hills}
<rect y="500" width="800" height="100" fill="#4a9b5d"/>
${trees}
</svg>`;
};
