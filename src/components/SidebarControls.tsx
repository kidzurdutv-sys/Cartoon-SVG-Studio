import React from 'react';
import { type CountryConfig, countryTokens } from '../engine/countryTokens';

interface SidebarControlsProps {
  activeTab: 'character' | 'environment' | 'prop';
  selectedCountry: string;
  setSelectedCountry: (id: string) => void;
  prompt: string;
  setPrompt: (val: string) => void;
  pose: string;
  setPose: (val: string) => void;
  onGenerate: () => void;
}

export const SidebarControls: React.FC<SidebarControlsProps> = ({
  activeTab,
  selectedCountry,
  setSelectedCountry,
  prompt,
  setPrompt,
  pose,
  setPose,
  onGenerate
}) => {
  return (
    <div className="w-80 bg-slate-800 border-r border-slate-700 p-6 flex flex-col h-full overflow-y-auto">
      <h2 className="text-xl font-bold mb-6 text-slate-100 flex items-center gap-2">
        <span className="text-blue-400">⚡</span> Studio Engine
      </h2>

      {/* Country Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Cultural Matrix (Country)
        </label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
        >
          {Object.values(countryTokens).map((country: CountryConfig) => (
            <option key={country.id} value={country.id}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pose Selection (Only for Characters) */}
      {activeTab === 'character' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Character Pose
          </label>
          <div className="flex bg-slate-900 rounded-md p-1 border border-slate-700">
            {['front', '3/4', 'profile'].map((p) => (
              <button
                key={p}
                onClick={() => setPose(p)}
                className={`flex-1 py-1.5 text-xs font-medium rounded capitalize transition-all ${
                  pose === p
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Prompt Input */}
      <div className="mb-6 flex-grow flex flex-col">
        <label className="block text-sm font-medium text-slate-400 mb-2">
          Asset Prompt Description
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe stylistic additions..."
          className="w-full flex-grow min-h-[150px] bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500 resize-none transition-colors"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-md transition-colors shadow-lg shadow-blue-500/20"
      >
        Compile {activeTab}
      </button>
    </div>
  );
};
