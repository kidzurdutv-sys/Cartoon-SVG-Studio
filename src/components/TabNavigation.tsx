import { useStudioStore } from '../store/studioStore';

export const TabNavigation = () => {
  const { activeTab, setActiveTab, canvasSVG } = useStudioStore();

  const tabs = [
    { id: 'generate', label: 'Generate', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    { id: 'rig', label: 'Rig', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="3"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="12" x2="16" y2="16"/><line x1="12" y1="12" x2="8" y2="16"/></svg>, requiresContent: true },
    { id: 'animate', label: 'Animate', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>, requiresContent: true },
    { id: 'export', label: 'Export', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>, requiresContent: true },
  ] as const;

  return (
    <div className="bg-gray-850 w-20 flex flex-col items-center py-4 space-y-4 border-r border-gray-700 h-full">
      {tabs.map((tab) => {
        const isDisabled = ('requiresContent' in tab ? tab.requiresContent : false) && !canvasSVG;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            disabled={isDisabled}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-500/20 text-indigo-400' : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'} ${isDisabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'}`}
            title={isDisabled ? 'Generate content first' : tab.label}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
