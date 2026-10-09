# Cartoon SVG Studio 🎨✨

An intelligent, AI-powered web application that generates production-ready, highly structured SVG assets for characters, environments, and props using Google's Gemini 2.0 Flash API.

## Features

- **🎨 Multi-Domain Generation**: Auto-generate character rigs, parallax-ready backgrounds, and distinct props using simple prompts.
- **🌍 Cultural Styling Matrices**: Apply dynamic styling configurations across multiple global aesthetics (e.g., Japanese Anime, Western Cartoon, South Asian).
- **💀 Advanced Auto-Rigging Engine**: The character engine parses geometry, calculates intersection bounds, and constructs a workable bone hierarchy for animation.
- **🎬 Keyframe Animation Preview**: Inject rotational attributes interactively along the bone hierarchy right inside the canvas.
- **📦 Zero-Dependency Asset Export**: Export your finalized work as flat SVGs or ZIP-archived project setups.

## Setup Instructions

1. Clone the repository.
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Provide your Google Gemini API Key:
   - Go to [Google AI Studio](https://aistudio.google.com/) and create a free API key.
   - Create a \`.env\` file based on the \`.env.example\`:
     \`\`\`env
     VITE_GEMINI_API_KEY=your-gemini-api-key-here
     \`\`\`
4. Run the local development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## Architecture Diagram

\`\`\`text
[ UI Layer - React/Tailwind ] <==> [ Zustand Store ] <==> [ Services Layer ]
       |                                |                        |
[ Canvas / Sidebar ]             [ Global State ]        [ Gemini 2.0 API ]
       |
[ Engines Layer ]
  - Character Auto-Rigging (Math Bound Parsing)
  - Environment Z-Layering (Parallax Sorting)
  - Prop Generation
\`\`\`

## Roadmap
- SMIL Native SVG Export (Full Animation embedded in a single `.svg` file).
- Advanced Path-Morphing for Facial Visemes.
- WebGL implementation for high-fidelity performance.