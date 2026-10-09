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
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

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
      throw new Error('Request to Gemini API timed out after 30 seconds.');
    }
    throw error;
  }
};

export const generateCartoonSVG = async (prompt: string, style: string, complexity: 'simple' | 'medium' | 'detailed'): Promise<string> => {
  const systemPrompt = `
You are an expert SVG illustrator engine. Your ONLY output should be a valid, production-ready raw SVG code.
DO NOT wrap the output in markdown blocks (e.g. xml) or add any conversational text.

Requirements:
- Root <svg> element MUST have viewBox="0 0 512 512" and width="100%" height="100%".
- Characters MUST be composed in separate <g> groups with the EXACT following IDs: "head", "body", "left-arm", "right-arm", "left-leg", "right-leg", "left-hand", "right-hand", "left-foot", "right-foot", "eye-left", "eye-right", "mouth", "hair".
- EACH of these semantic groups MUST have the attribute: data-rig="true".
- Use a flat cartoon style with solid fills (NO gradients, NO external image references).
- Use proper layering (back to front typically: legs, body, arms, head, hair).
- Ensure all colors are specified as hex values (e.g., #FF0000).
- Complexity level requested: ${complexity}. Adjust detail accordingly.
- Ensure proper semantic hierarchy and exact IDs so it can be auto-rigged.
`;

  const userPrompt = `Generate a highly structured SVG character for the following description: "${prompt}". Apply this stylistic direction: "${style}".`;

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
