'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import TabSwitcher from './TabSwitcher';
import CatalogTab from './tab-content/CatalogTab';
import GeneratedTab from './tab-content/GeneratedTab';
import HistoryTab from './tab-content/HistoryTab';

const tabs = [
  { key: 'catalog', label: 'Our Catalog' },
  { key: 'generated', label: 'Generated Designs' },
  { key: 'history', label: 'History' },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function CatalogSidebar({
  onClose,
  isMobileSidebarOpen = true,
}: {
  onClose?: () => void;
  isMobileSidebarOpen?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');

  const renderTabContent = () => {
    if (activeTab === 'catalog') return <CatalogTab onSelect={onClose} />;
    if (activeTab === 'generated') return <GeneratedTab onSelect={onClose} />;
    if (activeTab === 'history') return <HistoryTab onSelect={onClose} />;
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[320px] h-full bg-[#0B0B0B] z-[100] border-l border-[#1E1E1E] shadow-xl transform transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
    >
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#222]">
        <h2 className="text-white text-xl font-semibold">Explore</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition lg:hidden">
          <X size={20} />
        </button>
      </div>

      <TabSwitcher
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={(key) => setActiveTab(key as TabKey)}
      />

      <div className="px-4 py-3 overflow-y-auto h-[calc(100%-120px)]">
        {renderTabContent()}
      </div>
    </aside>
  );
}
