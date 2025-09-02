'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import CatalogTab from './tab-content/CatalogTab';
import GeneratedTab from './tab-content/GeneratedTab';
import UserTattooTab from './tab-content/UsertattooTab';
// import EditedOutputTab from './tab-content/EditedOutputTab'; // 👈 import here
import AccountBadge from './Profile/AccountBadge';

const defaultTabs = [
  { key: 'catalog', label: 'InkaraAI Tattoo’s' },
  { key: 'generated', label: 'User Generations' },
  // { key: 'edited', label: 'Edited Generations' }, // 👈 new tab
  { key: 'user-tattoos', label: 'My Tattoos' },
] as const;

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
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const renderTabContent = () => {
    if (activeTab.key === 'catalog')
      return <CatalogTab onSelect={isMobileSidebarOpen ? onClose : undefined} />;
    if (activeTab.key === 'generated') return <GeneratedTab />;
    // if (activeTab.key === 'edited') return <EditedOutputTab />; // 👈 added
    if (activeTab.key === 'user-tattoos') return <UserTattooTab />;
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[320px] h-screen bg-[#0B0B0B] z-[100] border-l border-[#1E1E1E] shadow-xl transform transition-transform duration-300
        flex flex-col
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
    >
      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-end m-2.5 p-3 lg:hidden">
          <button
            onClick={onClose}
            className="text-white hover:text-[#D0FE17] transition text-xl"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
      )}

      {/* Profile info */}
      <div className="px-4 py-3 border-b border-[#1E1E1E]">
        {/* <AccountBadge
          name="User Name"
          company="company"
          email="business@mail.com"
          phone="+91 1234567890"
          credits={20}
        /> */}
      </div>

      {/* Dropdown */}
      <div className="px-4 py-3 relative z-20" ref={dropdownRef}>
        <div
          className={`w-full border-[0.5px] rounded-lg bg-[#0B0B0B] ${
            isOpen ? 'border-[#D0FE17]' : 'border-[#ffffff]'
          } relative`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center px-4 py-2 text-left text-[#D0FE17] rounded-t-lg"
          >
            <span className="truncate">{activeTab.label}</span>
            <ChevronDown className="h-4 w-4 text-[#ffffff]" />
          </button>

          {isOpen && (
            <ul className="absolute left-0 top-full w-[calc(100%+2rem)] -ml-4 bg-[#0B0B0B] rounded-b-lg border border-[#333] shadow-lg z-50">
              {tabs.map((tab) => (
                <li
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsOpen(false);
                  }}
                  className={`cursor-pointer px-4 py-2 hover:bg-[#1A1A1A] ${
                    activeTab.key === tab.key
                      ? 'text-[#D0FE17] font-semibold'
                      : 'text-white'
                  }`}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">{renderTabContent()}</div>
    </aside>
  );
}
