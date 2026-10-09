import React from 'react';
import { User, Image as ImageIcon, Box } from 'lucide-react';

export type TabType = 'character' | 'environment' | 'prop';

interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'character', label: 'Characters', icon: <User size={18} /> },
    { id: 'environment', label: 'Environments', icon: <ImageIcon size={18} /> },
    { id: 'prop', label: 'Props', icon: <Box size={18} /> },
  ] as const;

  return (
    <div className="bg-slate-800 border-b border-slate-700 px-6 pt-4 flex space-x-2">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium rounded-t-lg transition-all ${
              isActive
                ? 'bg-slate-900 text-blue-400 border-t border-l border-r border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
