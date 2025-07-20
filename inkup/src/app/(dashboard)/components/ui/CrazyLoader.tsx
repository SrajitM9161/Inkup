// components/ui/CrazyLoader.tsx
'use client';

import { PuffLoader } from 'react-spinners';

export default function CrazyLoader({ size = 80, color = '#ff3366' }: { size?: number; color?: string }) {
  return (
    <div className="flex justify-center items-center py-8">
      <PuffLoader size={size} color={color} />
    </div>
  );
}
