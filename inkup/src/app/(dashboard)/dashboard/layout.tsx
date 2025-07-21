'use client';

import { useEffect } from 'react';
import { listenToGeneratedImages } from '../lib/sync';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    listenToGeneratedImages();
  }, []);

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}
