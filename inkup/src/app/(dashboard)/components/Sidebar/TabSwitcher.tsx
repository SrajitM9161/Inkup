'use client';

export interface Tab {
  key: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: readonly Tab[]; // accepts readonly arrays
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export default function TabSwitcher({ tabs, activeTab, setActiveTab }: TabSwitcherProps) {
  return (
    <div className="px-4 py-3 space-y-2 border-b border-[#222]">
      {tabs.map((tab) => (
        <div key={tab.key}>
          <button
            onClick={() => setActiveTab(tab.key)}
            className="w-full flex justify-between items-center text-left text-gray-300 bg-[#1A1A1A] px-3 py-2 rounded-md hover:bg-[#252525] transition"
          >
            {tab.label}
            <span>{activeTab === tab.key ? '▲' : '▼'}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
