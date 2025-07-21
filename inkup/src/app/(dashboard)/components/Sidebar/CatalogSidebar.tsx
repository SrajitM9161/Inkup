'use client';

import { useState, Fragment } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Listbox, Transition } from '@headlessui/react';
import CatalogTab from './tab-content/CatalogTab';
import GeneratedTab from './tab-content/GeneratedTab';
import HistoryTab from './tab-content/HistoryTab';

const defaultTabs = [
  { key: 'catalog', label: 'Workspace' },
  { key: 'generated', label: 'Your Workspace' },
  { key: 'history', label: 'History' },
] as const;

type TabKey = (typeof defaultTabs)[number]['key'];
type Tab = (typeof defaultTabs)[number];

export default function CatalogSidebar({
  onClose,
  isMobileSidebarOpen = true,
}: {
  onClose?: () => void;
  isMobileSidebarOpen?: boolean;
}) {
  const [tabs] = useState(defaultTabs);
  const [activeTab, setActiveTab] = useState<Tab>(defaultTabs[0]);

  const renderTabContent = () => {
    if (activeTab.key === 'catalog') return <CatalogTab onSelect={onClose} />;
    if (activeTab.key === 'generated') return <GeneratedTab onSelect={onClose} />;
    if (activeTab.key === 'history') return <HistoryTab onSelect={onClose} />;
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[320px] h-full bg-[#0B0B0B] z-[100] border-l border-[#1E1E1E] shadow-xl transform transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
    >
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#222]">
        <h2 className="text-white text-xl font-semibold">Work Space</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition lg:hidden">
          <X size={20} />
        </button>
      </div>

      <div className="px-4 py-3">
        <label className="text-white text-sm mb-2 block">Select Tab</label>
        <div className="relative">
          <Listbox value={activeTab} onChange={setActiveTab}>
            <div className="relative w-full">
              <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-[#1E1E1E] py-2 pl-4 pr-10 text-left text-white border border-[#333] focus:outline-none hover:border-[#555] transition">
                <span className="block truncate">{activeTab.label}</span>
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute mt-1 w-full rounded-lg bg-[#1E1E1E] border border-[#333] shadow-lg z-50 max-h-60 overflow-auto focus:outline-none">
                  {tabs.map((tab) => (
                    <Listbox.Option
                      key={tab.key}
                      value={tab}
                      className={({ active }) =>
                        `cursor-pointer select-none py-2 pl-4 pr-10 ${
                          active ? 'bg-[#2a2a2a]' : ''
                        }`
                      }
                    >
                      {({ selected }) => (
                        <span
                          className={`block truncate ${
                            selected ? 'text-[#00efff] font-semibold' : 'text-white'
                          }`}
                        >
                          {tab.label}
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        </div>
      </div>

      <div className="px-4 py-3 overflow-y-auto h-[calc(100%-160px)]">
        {renderTabContent()}
      </div>
    </aside>
  );
}
