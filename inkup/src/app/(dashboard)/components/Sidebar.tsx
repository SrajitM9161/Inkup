'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useToolStore } from '../lib/store';
import toast from 'react-hot-toast';

const catalogImages = [
  '/images/catalog1.png',
  '/images/catalog2.png',
  '/images/catalog3.png',
  '/images/catalog4.png',
  '/images/catalog5.png',
];

const tabs = [
  { key: 'catalog', label: 'Our Catalog' },
  { key: 'generated', label: 'Generated Designs' },
  { key: 'history', label: 'History' },
] as const;

type TabKey = typeof tabs[number]['key'];

export default function CatalogSidebar({
  onClose,
  isMobileSidebarOpen = true,
}: {
  onClose?: () => void;
  isMobileSidebarOpen?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>('catalog');

  const {
    setSelectedImage,
    setResultImage,
    generatedItems,
    bookmarks,
  } = useToolStore();

  const handleImageSelect = (img: string) => {
    setSelectedImage(img);
    setResultImage(img);
    toast.success('Image selected!');
    onClose?.();
  };

  const renderImages = (images: string[]) => (
    <div className="grid grid-cols-2 gap-4">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] cursor-pointer hover:ring-2 hover:ring-cyan-400 transition"
          onClick={() => handleImageSelect(img)}
        >
          <Image src={img} alt={`item-${idx}`} fill className="object-cover" />
        </div>
      ))}
    </div>
  );

  const renderTabContent = () => {
    if (activeTab === 'catalog') return renderImages(catalogImages);
    if (activeTab === 'generated')
      return generatedItems.length > 0
        ? renderImages(generatedItems)
        : <p className="text-gray-400 text-sm mt-2">No generated images yet.</p>;
    if (activeTab === 'history')
      return bookmarks.length > 0
        ? renderImages(bookmarks.map(b => b.image))
        : <p className="text-gray-400 text-sm mt-2">No history available.</p>;
  };

  return (
    <aside
      className={`fixed top-0 right-0 w-[320px] h-full bg-[#0B0B0B] z-[100] border-l border-[#1E1E1E] shadow-xl transform transition-transform duration-300
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'} 
        lg:translate-x-0 lg:static lg:block`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-[#222]">
        <h2 className="text-white text-xl font-semibold">Explore</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Dropdown Tabs (shared for desktop & mobile) */}
      <div className="px-4 py-3 space-y-2 border-b border-[#222]">
        {tabs.map((tab) => (
          <div key={tab.key}>
            <button
              onClick={() =>
                setActiveTab(activeTab === tab.key ? '' as TabKey : tab.key)
              }
              className="w-full flex justify-between items-center text-left text-gray-300 bg-[#1A1A1A] px-3 py-2 rounded-md hover:bg-[#252525] transition"
            >
              {tab.label}
              <span>{activeTab === tab.key ? '▲' : '▼'}</span>
            </button>
            {activeTab === tab.key && (
              <div className="mt-2 pl-1">{renderTabContent()}</div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
