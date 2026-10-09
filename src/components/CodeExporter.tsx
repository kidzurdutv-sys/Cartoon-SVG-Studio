import React, { useState } from 'react';
import { Code2, Copy, Check } from 'lucide-react';

interface CodeExporterProps {
  svgContent: string;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({ svgContent }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(svgContent).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <div className="w-96 bg-slate-800 border-l border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
          <Code2 size={16} className="text-blue-400" /> RAW SVG EXPORT
        </h3>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          title="Copy SVG Code"
        >
          {isCopied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto font-mono text-[10px] sm:text-xs text-slate-400 leading-relaxed custom-scrollbar">
        <pre className="whitespace-pre-wrap break-all">
          {svgContent || '/* Compile an asset to view raw SVG data */'}
        </pre>
      </div>
    </div>
  );
};
