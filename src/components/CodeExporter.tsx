import React, { useState } from 'react';
import { useStudioStore } from '../store/studioStore';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export const CodeExporter: React.FC = () => {
  const store = useStudioStore();
  const [copied, setCopied] = useState(false);

  // Reconstruct basic SVG for export view
  let exportCode = '';
  if (store.canvasSVG || store.environmentSVG) {
    exportCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 512" width="100%" height="100%">
`;
    if (store.environmentSVG) exportCode += `  ${store.environmentSVG}
`;
    if (store.canvasSVG) exportCode += `  ${store.canvasSVG}
`;
    exportCode += `</svg>`;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(exportCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([exportCode], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'cartoon-studio-export.svg');
  };

  const handleDownloadZip = () => {
    const zip = new JSZip();
    zip.file("character.svg", store.canvasSVG || "");
    zip.file("environment.svg", store.environmentSVG || "");
    zip.file("composed.svg", exportCode);

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "cartoon-studio-project.zip");
    });
  };

  if (!exportCode) return null;

  return (
    <div className="w-80 bg-gray-900 border-l border-gray-700 flex flex-col h-full font-mono text-[10px]">
      <div className="p-3 border-b border-gray-700 flex justify-between items-center bg-gray-850">
        <span className="text-gray-400 font-semibold uppercase">Output Source</span>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="text-indigo-400 hover:text-indigo-300">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 text-gray-500 whitespace-pre-wrap break-all custom-scrollbar">
        {exportCode}
      </div>

      <div className="p-3 border-t border-gray-700 bg-gray-850 flex flex-col gap-2">
        <button onClick={handleDownloadSVG} className="bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded">Download .svg</button>
        <button onClick={handleDownloadZip} className="bg-gray-700 hover:bg-gray-600 text-white py-1.5 rounded">Download .zip</button>
      </div>
    </div>
  );
};
