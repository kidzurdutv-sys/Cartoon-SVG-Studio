import React, { useState } from 'react';
import { useStudioStore } from '../store/studioStore';
import { generateCartoonSVG, generateEnvironmentSVG, generatePropSVG } from '../services/geminiService';
import { STYLE_PRESETS, getStylePromptModifier } from '../engine/countryTokens';
import { autoRigCharacter, validateRig } from '../engine/characterRig';
import { createProp } from '../engine/propRig';
import { type Bone, type Keyframe } from '../types';

export const SidebarControls: React.FC = () => {
  const store = useStudioStore();

  return (
    <div className="w-80 bg-gray-850 border-l border-gray-700 flex flex-col h-full overflow-y-auto text-sm">
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-bold text-gray-100 uppercase tracking-wider text-xs">
          {store.activeTab} Controls
        </h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {store.activeTab === 'generate' && <GeneratePanel />}
        {store.activeTab === 'rig' && <RigPanel />}
        {store.activeTab === 'animate' && <AnimatePanel />}
        {store.activeTab === 'export' && <ExportPanel />}
      </div>
    </div>
  );
};

const GeneratePanel = () => {
  const store = useStudioStore();
  const [charPrompt, setCharPrompt] = useState('A brave knight');
  const [envPrompt, setEnvPrompt] = useState('A dark spooky forest');
  const [propPrompt, setPropPrompt] = useState('A magical sword');
  const [styleId, setStyleId] = useState(STYLE_PRESETS[0].id);
  const [complexity, setComplexity] = useState<'simple'|'medium'|'detailed'>('medium');

  const handleGenerateChar = async () => {
    store.setIsGenerating(true);
    store.setGenerationError(null);
    try {
      const promptMod = getStylePromptModifier(styleId);
      const svg = await generateCartoonSVG(`${charPrompt} ${promptMod}`, styleId, complexity);
      store.setCanvasSVG(svg);
    } catch (e: any) {
      store.setGenerationError(e.message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleGenerateEnv = async () => {
    store.setIsGenerating(true);
    try {
      const svg = await generateEnvironmentSVG(envPrompt);
      store.setEnvironmentSVG(svg);
    } catch (e: any) {
      store.setGenerationError(e.message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  const handleGenerateProp = async () => {
    store.setIsGenerating(true);
    try {
      const svg = await generatePropSVG(propPrompt);
      const newProp = createProp(svg, 0, 0);
      store.addProp(newProp);
    } catch (e: any) {
      store.setGenerationError(e.message);
    } finally {
      store.setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {store.generationError && (
        <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded-lg text-xs">
          {store.generationError}
        </div>
      )}

      {/* Character Gen */}
      <div className="space-y-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-300">Character Generator</h3>
        <textarea
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white h-20 resize-none focus:border-indigo-500 outline-none"
          value={charPrompt} onChange={e => setCharPrompt(e.target.value)}
          placeholder="Character description..."
        />
        <div className="flex gap-2">
           <select
             className="flex-1 bg-gray-900 border border-gray-600 rounded p-1 text-white outline-none"
             value={styleId} onChange={e => setStyleId(e.target.value)}
           >
             {STYLE_PRESETS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
           </select>
           <select
             className="w-24 bg-gray-900 border border-gray-600 rounded p-1 text-white outline-none"
             value={complexity} onChange={e => setComplexity(e.target.value as any)}
           >
             <option value="simple">Simple</option>
             <option value="medium">Med</option>
             <option value="detailed">Detail</option>
           </select>
        </div>
        <button
          disabled={store.isGenerating || charPrompt.length < 5}
          onClick={handleGenerateChar}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-gray-500 text-white py-2 rounded transition-colors font-medium"
        >
          {store.isGenerating ? 'Generating...' : 'Generate Character'}
        </button>
      </div>

      {/* Environment Gen */}
      <div className="space-y-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-300">Environment Generator</h3>
        <input
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-indigo-500"
          value={envPrompt} onChange={e => setEnvPrompt(e.target.value)}
        />
        <button
          disabled={store.isGenerating || envPrompt.length < 5}
          onClick={handleGenerateEnv}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
        >
          Generate Background
        </button>
      </div>

      {/* Prop Gen */}
      <div className="space-y-3 bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-300">Prop Generator</h3>
        <input
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none focus:border-indigo-500"
          value={propPrompt} onChange={e => setPropPrompt(e.target.value)}
        />
        <button
          disabled={store.isGenerating || propPrompt.length < 5}
          onClick={handleGenerateProp}
          className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded transition-colors"
        >
          Add Prop
        </button>
      </div>
    </div>
  );
};

const RigPanel = () => {
  const store = useStudioStore();
  const [validationMsg, setValidationMsg] = useState<{valid: boolean, msg: string} | null>(null);

  const handleAutoRig = () => {
    if (!store.canvasSVG) return;
    const rig = autoRigCharacter(store.canvasSVG);
    store.setRigData(rig);

    // Add default keyframe 0
    if (store.animationKeyframes.length === 0) {
      store.addKeyframe({ id: 'kf-0', time: 0, boneValues: {} });
    }
  };

  const handleValidate = () => {
    if (!store.rigData) return;
    const { valid, errors } = validateRig(store.rigData);
    if (valid) {
      setValidationMsg({ valid: true, msg: 'Rig passed all structural checks.' });
    } else {
      setValidationMsg({ valid: false, msg: errors.join(', ') });
    }
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleAutoRig}
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-medium shadow"
      >
        Auto-Rig Character
      </button>

      {store.rigData && (
        <>
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 space-y-3">
            <div className="flex justify-between items-center">
               <h3 className="text-xs font-semibold text-gray-300">Rig Hierarchy</h3>
               <button onClick={handleValidate} className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600">Validate</button>
            </div>

            {validationMsg && (
              <div className={`p-2 text-[10px] rounded ${validationMsg.valid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {validationMsg.msg}
              </div>
            )}

            <div className="h-48 overflow-y-auto custom-scrollbar pr-2">
              <ul className="text-xs text-gray-400 space-y-1">
                {store.rigData.bones.map((b: Bone) => (
                  <li
                    key={b.id}
                    className={`p-1 rounded cursor-pointer ${store.selectedElementId === b.id ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-gray-700'}`}
                    onClick={() => store.selectElement(b.id)}
                  >
                    {b.parentId ? ' └ ' : ''} {b.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {store.selectedElementId && (
            <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
               <h3 className="text-xs font-semibold text-gray-300 mb-2">Joint Controls</h3>
               <p className="text-xs text-gray-500 mb-2">Origin Adjust (x,y)</p>
               <input type="range" min="-50" max="50" defaultValue="0" className="w-full mb-1" />
               <input type="range" min="-50" max="50" defaultValue="0" className="w-full" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

const AnimatePanel = () => {
  const store = useStudioStore();

  const handleAddKeyframe = () => {
    const nextTime = store.animationKeyframes.length > 0
      ? store.animationKeyframes[store.animationKeyframes.length-1].time + 1
      : 0;

    // For demo, we just copy the previous frame's values if they exist, or start fresh
    const lastValues = store.animationKeyframes.length > 0
      ? store.animationKeyframes[store.animationKeyframes.length-1].boneValues
      : {};

    const nextId = `kf-${Date.now()}`;
    store.addKeyframe({ id: nextId, time: nextTime, boneValues: { ...lastValues } });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <button className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-1.5 rounded text-xs font-medium">Play</button>
        <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded text-xs">Stop</button>
      </div>

      <button onClick={handleAddKeyframe} className="w-full border border-dashed border-gray-600 hover:border-indigo-400 text-gray-400 hover:text-indigo-400 py-2 rounded text-xs">
        + Add Keyframe
      </button>

      <div className="space-y-2">
        {store.animationKeyframes.map((kf: Keyframe, i: number) => (
           <div key={kf.id} className="flex justify-between items-center bg-gray-800 p-2 rounded border border-gray-700">
             <span className="text-xs text-gray-300">Frame {i} (T: {kf.time}s)</span>
             <button onClick={() => store.deleteKeyframe(kf.id)} className="text-red-400 hover:text-red-300 text-xs">Del</button>
           </div>
        ))}
      </div>

      {/* Example Rotation Slider if a bone is selected */}
      {store.selectedElementId && store.animationKeyframes.length > 0 && (
         <div className="bg-gray-800 p-3 rounded border border-gray-700 mt-4">
            <p className="text-xs text-gray-400 mb-2">Rotate {store.selectedElementId}</p>
            <input
              type="range" min="-180" max="180" defaultValue="0"
              className="w-full"
              onChange={(e) => {
                 const currentKf = store.animationKeyframes[store.animationKeyframes.length-1];
                 const updatedValues = { ...currentKf.boneValues, [store.selectedElementId!]: parseInt(e.target.value) };
                 store.updateKeyframe(currentKf.id, { boneValues: updatedValues });
              }}
            />
         </div>
      )}
    </div>
  );
};

const ExportPanel = () => {
  const [format, setFormat] = useState('svg');

  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h3 className="text-xs font-semibold text-gray-300 mb-3">Format</h3>
        <select
          className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none mb-3 text-xs"
          value={format} onChange={e => setFormat(e.target.value)}
        >
          <option value="svg">Static SVG</option>
          <option value="animated-svg">Animated SVG (SMIL)</option>
          <option value="png-sequence">PNG Sequence (ZIP)</option>
        </select>

        {format === 'png-sequence' && (
          <div className="flex gap-2">
             <select className="flex-1 bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none text-xs">
                <option>24 FPS</option>
                <option>30 FPS</option>
             </select>
             <select className="flex-1 bg-gray-900 border border-gray-600 rounded p-2 text-white outline-none text-xs">
                <option>512x512</option>
                <option>1024x1024</option>
             </select>
          </div>
        )}
      </div>

      <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded font-medium shadow">
        {format === 'png-sequence' ? 'Export ZIP' : 'Download File'}
      </button>
    </div>
  );
};
