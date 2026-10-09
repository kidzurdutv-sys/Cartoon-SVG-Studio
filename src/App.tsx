import { useState, useEffect, useCallback } from 'react';
import { SidebarControls } from './components/SidebarControls';
import { TabNavigation, type TabType } from './components/TabNavigation';
import { SvgCanvas } from './components/SvgCanvas';
import { CodeExporter } from './components/CodeExporter';

import { countryTokens } from './engine/countryTokens';
import { generateCharacterRig } from './engine/characterRig';
import { generateEnvironmentRig } from './engine/environmentRig';
import { generatePropRig } from './engine/propRig';
import { hashSeed } from './engine/rng';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('character');
  const [selectedCountry, setSelectedCountry] = useState<string>('pakistan');
  const [prompt, setPrompt] = useState('');
  const [pose, setPose] = useState('3/4');
  const [seed, setSeed] = useState<number>(() => Math.floor(Math.random() * 1e9));

  const [svgContent, setSvgContent] = useState('');

  const handleGenerate = useCallback(() => {
    const config = countryTokens[selectedCountry];
    if (!config) return;

    // New character every compile: fresh random seed, prompt text nudges it
    const newSeed = (Math.floor(Math.random() * 1e9) ^ hashSeed(prompt.trim())) >>> 0;
    setSeed(newSeed);

    let newSvg = '';

    switch (activeTab) {
      case 'character':
        newSvg = generateCharacterRig(config, pose, newSeed);
        break;
      case 'environment':
        newSvg = generateEnvironmentRig(config, newSeed);
        break;
      case 'prop':
        newSvg = generatePropRig(config, newSeed);
        break;
    }

    setSvgContent(newSvg);
  }, [activeTab, selectedCountry, pose, prompt]);

  // Generate on initial load
  useEffect(() => {
    handleGenerate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-slate-900 text-slate-100 overflow-hidden">

      {/* Top Navigation */}
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Sidebar Controls */}
        <SidebarControls
          activeTab={activeTab}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          prompt={prompt}
          setPrompt={setPrompt}
          pose={pose}
          setPose={setPose}
          onGenerate={handleGenerate}
        />

        {/* Canvas Renderer */}
        <SvgCanvas svgContent={svgContent} activeTab={activeTab} />

        {/* Raw Code Exporter */}
        <CodeExporter svgContent={svgContent} />

      </div>

      {/* Seed footer */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-1.5 text-[11px] font-mono text-slate-500 flex items-center gap-2">
        <span className="text-slate-600">SEED</span>
        <span className="text-blue-400">{seed}</span>
        <span className="text-slate-700">— same seed, same character. Compile again for a new one.</span>
      </div>
    </div>
  );
}

export default App;
