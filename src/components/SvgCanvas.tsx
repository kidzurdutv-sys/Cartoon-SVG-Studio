import { useRef, useState } from 'react';
import { type TabType } from './TabNavigation';

interface SvgCanvasProps {
  svgContent: string;
  activeTab: TabType;
}

export const SvgCanvas: React.FC<SvgCanvasProps> = ({ svgContent, activeTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimal test rig interaction
  const [visemeIndex, setVisemeIndex] = useState(0);
  const visemes = ['rest', 'A', 'E', 'O'];

  const handleTestRig = () => {
    if (activeTab === 'character') {
      const svgDoc = containerRef.current?.querySelector('svg');
      if (svgDoc) {
        const mouthGroup = svgDoc.querySelector('#mouth-phonemes');
        if (mouthGroup) {
          // Cycle visemes for demonstration
          const nextIndex = (visemeIndex + 1) % visemes.length;
          setVisemeIndex(nextIndex);
          mouthGroup.innerHTML = `<use href="#viseme-${visemes[nextIndex]}" x="0" y="0" />`;
        }

        // Blink test
        const eyesGroup = svgDoc.querySelector('#eyes-group');
        if (eyesGroup) {
          const orig = eyesGroup.innerHTML;
          eyesGroup.innerHTML = `<use href="#eye-blink" x="-25" y="0" /><use href="#eye-blink" x="25" y="0" />`;
          setTimeout(() => {
            if (eyesGroup) eyesGroup.innerHTML = orig;
          }, 150);
        }
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-900 p-8 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Test Controls */}
      {activeTab === 'character' && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleTestRig}
            className="bg-slate-800 hover:bg-slate-700 text-xs text-blue-400 border border-slate-600 px-4 py-2 rounded shadow transition-colors"
          >
            Test Visemes & Blink
          </button>
        </div>
      )}

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
      </div>

      {/* Canvas Area with Bounding Box Styling */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-3xl h-full max-h-[700px] border border-slate-700 bg-slate-950/50 rounded-xl shadow-2xl flex items-center justify-center p-4"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      {/* Footer Info */}
      <div className="mt-6 text-xs text-slate-500 font-mono">
        CANVAS RENDERER :: ACTIVE BOUNDING BOX ENABLED :: Z-INDEX VALIDATION OK
      </div>
    </div>
  );
};
