import { useRef, useState } from 'react';
import { useStudioStore } from '../store/studioStore';
import { applyParallax, parseEnvironmentSVG } from '../engine/environmentRig';
import { serializeProps } from '../engine/propRig';
import { getBoneTransform } from '../engine/characterRig';

export const SvgCanvas: React.FC = () => {
  const {
    canvasSVG,
    environmentSVG,
    props,
    selectedElementId,
    selectElement,
    activeTab,
    rigData,
    animationKeyframes
  } = useStudioStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);

  // Parallax demo state
  const [camera, setCamera] = useState({ x: 0, y: 0 });

  // Handle Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomSensitivity = 0.001;
      const delta = -e.deltaY * zoomSensitivity;
      let newScale = scale + delta;
      newScale = Math.min(Math.max(0.1, newScale), 5);
      setScale(newScale);
    } else {
      setPan({ x: pan.x - e.deltaX, y: pan.y - e.deltaY });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0 && e.target === containerRef.current) { // Middle click or bg click
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      selectElement(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }

    if (activeTab === 'animate' && environmentSVG) {
       // Demo parallax based on mouse
       const bounds = containerRef.current?.getBoundingClientRect();
       if (bounds) {
           const cx = ((e.clientX - bounds.left) / bounds.width - 0.5) * -100;
           const cy = ((e.clientY - bounds.top) / bounds.height - 0.5) * -50;
           setCamera({ x: cx, y: cy });
       }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Compose Final SVG
  let composedSVG = '';

  if (environmentSVG) {
      const envRig = parseEnvironmentSVG(environmentSVG);
      composedSVG += applyParallax(envRig, camera.x, camera.y);
  }

  if (canvasSVG) {
      // Very basic rig transform injection for UI preview
      let charStr = canvasSVG;
      if (activeTab === 'animate' && rigData && animationKeyframes.length > 0) {
          const kf = animationKeyframes[animationKeyframes.length - 1]; // Use last frame for preview
          rigData.bones.forEach(b => {
              const transformStr = getBoneTransform(b.id, rigData, kf.boneValues);
              if (transformStr) {
                  // Find the group and inject transform
                  const regex = new RegExp(`<g[^>]*id="${b.name}"[^>]*>`, 'g');
                  charStr = charStr.replace(regex, (match) => {
                      if (match.includes('transform=')) {
                           return match.replace(/transform="([^"]*)"/, `transform="$1 ${transformStr}"`);
                      }
                      return match.replace('<g', `<g transform="${transformStr}"`);
                  });
              }
          });
      }

      // Inject bounding box highlights if selected
      if (selectedElementId && activeTab === 'rig') {
         // Hacky highlight for demo via regex injection
         const regex = new RegExp(`<g[^>]*id="${selectedElementId.replace('bone-', '')}"[^>]*>`, 'g');
         charStr = charStr.replace(regex, (match) => match.replace('<g', `<g class="outline outline-2 outline-indigo-500 drop-shadow-lg"`));
      }

      composedSVG += charStr;
  }

  if (props.length > 0) {
      composedSVG += `<svg viewBox="0 0 512 512" width="100%" height="100%" style="position:absolute;top:0;left:0;pointer-events:none;">${serializeProps(props)}</svg>`;
  }

  // Rig Visualization Layer
  const renderRigVisuals = () => {
    if (activeTab !== 'rig' || !rigData) return null;
    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full z-10" viewBox="0 0 512 512">
        {/* Draw Bones (Connections) */}
        {rigData.joints.map(j => {
           const bone = rigData.bones.find(b => b.id === j.boneId);
           const parentBone = rigData.bones.find(b => b.id === bone?.parentId);
           if (bone && parentBone) {
              return (
                <line
                  key={`line-${j.id}`}
                  x1={parentBone.origin.x} y1={parentBone.origin.y}
                  x2={bone.origin.x} y2={bone.origin.y}
                  stroke="#6366f1" strokeWidth="4" strokeLinecap="round" opacity="0.6"
                />
              );
           }
           return null;
        })}
        {/* Draw Joints */}
        {rigData.bones.map(b => (
           <circle
             key={b.id}
             cx={b.origin.x} cy={b.origin.y}
             r="8"
             fill="#ffffff"
             stroke="#6366f1"
             strokeWidth="3"
             className="pointer-events-auto cursor-pointer hover:fill-indigo-200 transition-colors"
             onClick={(e) => { e.stopPropagation(); selectElement(b.id); }}
           />
        ))}
      </svg>
    );
  };

  return (
    <div
      className="flex-1 bg-gray-800 relative overflow-hidden flex flex-col"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Top toolbar for canvas */}
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button onClick={() => setShowGrid(!showGrid)} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded shadow border border-gray-600">
          Grid: {showGrid ? 'On' : 'Off'}
        </button>
        <button onClick={() => { setScale(1); setPan({x: 0, y: 0}); }} className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-xs text-white rounded shadow border border-gray-600">
          Reset View
        </button>
        <span className="px-3 py-1 bg-gray-800 text-xs text-gray-400 rounded border border-gray-700 cursor-default">
          Zoom: {Math.round(scale * 100)}%
        </span>
      </div>

      {/* The Canvas Area */}
      <div
        ref={containerRef}
        className={`w-full h-full relative ${showGrid ? 'bg-grid-pattern' : ''}`}
        style={{
          backgroundSize: `${32 * scale}px ${32 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div
          className="absolute origin-top-left flex items-center justify-center w-[512px] h-[512px] top-1/2 left-1/2 -mt-[256px] -ml-[256px] shadow-2xl bg-white/5"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          }}
        >
          {/* Main SVG Render */}
          {composedSVG ? (
            <>
              <div
                className="w-full h-full relative"
                dangerouslySetInnerHTML={{ __html: composedSVG }}
              />
              {renderRigVisuals()}
            </>
          ) : (
            <div className="text-gray-500 font-medium opacity-50 select-none">
              Generate an asset to begin
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
