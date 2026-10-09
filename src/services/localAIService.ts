// Local AI service — apna engine, koi API key nahi chahiye.
// Gemini ki jaga seeded procedural generators (Bold 2D cartoon, Style 3).
// Har Generate click par fresh seed -> naya character/environment/prop.
import { generateCharacterRig } from '../engine/characterRig';
import { generateEnvironmentRig } from '../engine/seeded/environment';
import { generatePropRig } from '../engine/seeded/prop';
import { countryTokens } from '../engine/seeded/country';

// Simple string hash -> uint32 (prompt se seed)
function hashPrompt(s: string): number {
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}

const freshSeed = (prompt: string): number =>
	(hashPrompt(prompt) + Date.now() + Math.floor(Math.random() * 1e9)) >>> 0;

const pickCountry = (prompt: string) => {
	const keys = Object.keys(countryTokens);
	const lower = prompt.toLowerCase();
	for (const k of keys) {
		if (lower.includes(k)) return countryTokens[k];
	}
	return countryTokens[keys[hashPrompt(prompt) % keys.length]];
};

const simDelay = () => new Promise((r) => setTimeout(r, 350));

export const generateCartoonSVG = async (
	prompt: string,
	_style: string,
	_complexity: 'simple' | 'medium' | 'detailed',
): Promise<string> => {
	await simDelay();
	const country = pickCountry(prompt);
	// pose: prompt mein "side"/"profile" ho to profile, warna front
	const pose = /profile|side view/i.test(prompt) ? 'profile' : 'front';
	return generateCharacterRig(country, pose, freshSeed(prompt));
};

export const generateEnvironmentSVG = async (prompt: string): Promise<string> => {
	await simDelay();
	const country = pickCountry(prompt);
	return generateEnvironmentRig(country, freshSeed(prompt));
};

export const generatePropSVG = async (prompt: string): Promise<string> => {
	await simDelay();
	const country = pickCountry(prompt);
	return generatePropRig(country, freshSeed(prompt));
};
