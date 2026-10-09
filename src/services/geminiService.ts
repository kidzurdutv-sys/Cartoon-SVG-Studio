const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-001:generateContent';

interface GeminiResponse {
  candidates?: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
  error?: {
    message: string;
  };
}

const fetchFromGemini = async (systemInstruction: string, userPrompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 seconds timeout

  try {
    const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemInstruction }]
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: userPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for more deterministic/structured output
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No content generated from the model.');
    }

    // Extract SVG from markdown code blocks if present
    const svgMatch = text.match(/<svg[\s\S]*?<\/svg>/i);
    if (svgMatch) {
      return svgMatch[0];
    }

    return text;

  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request to Gemini API timed out after 60 seconds.');
    }
    throw error;
  }
};

export const generateCartoonSVG = async (prompt: string, style: string, complexity: 'simple' | 'medium' | 'detailed'): Promise<string> => {
  const systemPrompt = `
You are an expert, world-class SVG illustrator engine capable of generating extremely precise, mathematically rigorous, high-end vector structures for 2D animation.
Your ONLY output MUST be a single, valid, production-ready raw SVG code string.
DO NOT wrap the output in markdown blocks (e.g. \`\`\`xml) or add any conversational text.

Core Rigging & Geometric Requirements:
- The root <svg> element MUST have viewBox="0 0 512 512" and width="100%" height="100%".
- You MUST construct the character using precise semantic <g> (group) tags.
- The required group IDs MUST BE exactly: "rig-head", "rig-torso", "rig-armL", "rig-armR", "rig-legL", "rig-legR".
- YOU MUST INCLUDE HANDS AND FEET geometry integrated within the respective arm/leg groups (e.g. hands inside rig-armL).
- EVERY rig group (except torso) MUST have a \`data-pivot="X,Y"\` attribute specifying the exact mathematical center point of rotation (joint) for that limb in the 512x512 coordinate space (e.g. data-pivot="256,150" for a head connected to the torso).
- Ensure proper depth layering (from back to front): rig-armL (or R depending on pose), rig-legL, rig-torso, rig-legR, rig-armR, rig-head.
- Include a <defs> block containing phoneme visemes inside.
- High-fidelity aesthetic requested: Use exact colors (hex values), meticulously crafted paths (not just primitive circles/rectangles, use <path d="..."> for organic shapes). Do NOT use gradients or external images.
- Complexity level requested: ${complexity}. Add robust geometric detail (clothing folds, facial features, accessories) fitting the complexity.

Visemes & Facial Structure Requirements:
- Inside the "rig-head" group, you MUST include a nested <g id="mouth-phonemes">.
- The <defs> MUST contain the following IDs for lip-sync: "viseme-rest", "viseme-A", "viseme-E", "viseme-O".
- Inside "rig-head", include eyes in a <g id="eyes-group">, and in <defs> include an "eye-blink" path that can be toggled.
- The mouth-phonemes group should use a <use href="#viseme-rest" x="..." y="..." /> by default.
`;

  const userPrompt = `Generate a high-end, extremely structured rigged SVG character for the following description: "${prompt}". Apply this stylistic direction: "${style}". Ensure you include rigorous path geometries for a complete body including torso, head, detailed arms, detailed hands, legs, and feet. Add the exact \`data-pivot\` coordinates for all limbs.`;

  return fetchFromGemini(systemPrompt, userPrompt);
};

export const generateEnvironmentSVG = async (prompt: string): Promise<string> => {
  const systemPrompt = `
You are an expert SVG illustrator engine. Your ONLY output should be valid, raw SVG code.
DO NOT wrap the output in markdown blocks.

Requirements:
- Root <svg> element MUST have viewBox="0 0 1024 512" and width="100%" height="100%".
- Create a layered 2D environment background.
- Group elements into exactly these layer groups in back-to-front order:
  <g id="layer-sky">, <g id="layer-far">, <g id="layer-mid">, <g id="layer-near">.
- Use solid fills (hex colors), no complex gradients unless essential.
- Ensure clear visual depth for parallax scrolling.
`;

  return fetchFromGemini(systemPrompt, `Generate a layered environment SVG background based on: "${prompt}"`);
};

export const generatePropSVG = async (prompt: string): Promise<string> => {
  const systemPrompt = `
You are an expert SVG illustrator engine. Your ONLY output should be valid, raw SVG code.
DO NOT wrap the output in markdown blocks.

Requirements:
- Root <svg> element MUST have viewBox="0 0 256 256" and width="100%" height="100%".
- Generate a single, centered, stylized prop/item.
- Wrap the main prop geometry in a <g id="prop-root">.
- Use solid flat colors (hex). No gradients.
`;

  return fetchFromGemini(systemPrompt, `Generate a single prop SVG based on: "${prompt}"`);
};
