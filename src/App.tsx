import { useState, useEffect } from 'react';
import { SidebarControls } from './components/SidebarControls';
import { TabNavigation, type TabType } from './components/TabNavigation';
import { SvgCanvas } from './components/SvgCanvas';
import { CodeExporter } from './components/CodeExporter';

import { countryTokens } from './engine/countryTokens';
import { generateCharacterRig } from './engine/characterRig';
import { generateEnvironmentRig } from './engine/environmentRig';
import { generatePropRig } from './engine/propRig';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('character');
  const [selectedCountry, setSelectedCountry] = useState<string>('pakistan');
  const [prompt, setPrompt] = useState('');
  const [pose, setPose] = useState('3/4');

  const [svgContent, setSvgContent] = useState('');

  const handleGenerate = () => {
    const config = countryTokens[selectedCountry];
    if (!config) return;

    let newSvg = '';

    switch (activeTab) {
      case 'character':
        newSvg = generateCharacterRig(config, pose);
        break;
      case 'environment':
        newSvg = generateEnvironmentRig(config);
        break;
      case 'prop':
        newSvg = generatePropRig(config);
        break;
    }

    setSvgContent(newSvg);
  };

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
    </div>
  );
}

export default App;
