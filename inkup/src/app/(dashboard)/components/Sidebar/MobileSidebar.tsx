'use client';

import CatalogSidebar from './CatalogSidebar';

export default function MobileSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <CatalogSidebar isMobileSidebarOpen={isOpen} onClose={onClose} />
    </div>
  );
}