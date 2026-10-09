import { useEffect, useState } from 'react';
import { TabNavigation } from './components/TabNavigation';
import { SidebarControls } from './components/SidebarControls';
import { SvgCanvas } from './components/SvgCanvas';
import { CodeExporter } from './components/CodeExporter';
import { useStudioStore } from './store/studioStore';

function App() {
  const store = useStudioStore();
  const [isMobile, setIsMobile] = useState(false);

  // Check window size on mount and resize
  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 1024);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z for Undo
      if (e.ctrlKey && e.key === 'z') {
        store.undo();
      }
      // Ctrl+Y for Redo
      if (e.ctrlKey && e.key === 'y') {
        store.redo();
      }
      // Delete selected
      if (e.key === 'Delete' && store.selectedElementId) {
        // Technically logic needed here to determine if deleting a prop or bone, but for props:
        if (store.selectedElementId.startsWith('prop-')) {
          store.removeProp(store.selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [store]);

  if (isMobile) {
    return (
      <div className="h-screen w-full bg-gray-900 text-white flex items-center justify-center p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold text-indigo-500 mb-4">Cartoon SVG Studio</h1>
          <p className="text-gray-400">Please use a desktop browser (minimum 1024px width) for the studio interface.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-gray-900 text-gray-100 overflow-hidden select-none">

      {/* Top Bar */}
      <header className="h-12 bg-gray-850 border-b border-gray-700 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <div className="font-bold text-indigo-400 tracking-wide flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            CARTOON SVG STUDIO
          </div>
          <div className="h-4 w-px bg-gray-600 mx-2"></div>
          <button onClick={() => store.undo()} disabled={store.historyIndex <= 0} className="text-xs font-medium text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg> Undo
          </button>
          <button onClick={() => store.redo()} disabled={store.historyIndex >= store.history.length - 1} className="text-xs font-medium text-gray-400 hover:text-white disabled:opacity-30 flex items-center gap-1">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg> Redo
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={() => store.resetCanvas()} className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded transition-colors font-medium">
            New Project
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded transition-colors font-medium shadow-lg shadow-indigo-500/20">
            Save
          </button>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Nav */}
        <TabNavigation />

        {/* Middle Canvas */}
        <SvgCanvas />

        {/* Right Sidebar Controls */}
        <SidebarControls />

        {/* Optional Exporter Panel (Show only in export tab or generally visible in standard view based on UI pref) */}
        {store.activeTab === 'export' && <CodeExporter />}

      </div>
    </div>
  );
}

export default App;
