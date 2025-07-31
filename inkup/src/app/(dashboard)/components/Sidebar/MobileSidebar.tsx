'use client';

import CatalogSidebar from './CatalogSidebar';

export default function MobileSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'hidden'}`}>
      {/* Overlay that closes the sidebar */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Sidebar container to stop event bubbling */}
      <div
        className="relative z-50 w-4/5 max-w-xs h-full bg-[#1A1A1A]"
        onClick={(e) => e.stopPropagation()}
      >
        <CatalogSidebar isMobileSidebarOpen={isOpen} onClose={onClose} />
      </div>
    </div>
  );
}
