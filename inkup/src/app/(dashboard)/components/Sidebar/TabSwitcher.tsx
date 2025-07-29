'use client';

export interface Tab {
  key: string;
  label: string;
}

interface TabSwitcherProps {
  tabs: readonly Tab[];
  activeTab: string;
  setActiveTab: (key: string) => void;
}

export default function TabSwitcher({
  tabs,
  activeTab,
  setActiveTab,
}: TabSwitcherProps) {
  return (
    <div className="space-y-2 border-b bg-[#1A1A1A]">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`w-full flex justify-between items-center text-left text-sm px-4 py-3 transition rounded-none ${
            activeTab === tab.key
              ? 'bg-[#252525] text-white'
              : 'text-gray-300 hover:bg-[#2a2a2a]'
          }`}
        >
          {tab.label}
          <span>{activeTab === tab.key ? '▲' : '▼'}</span>
        </button>
      ))}
    </div>
  );
}
