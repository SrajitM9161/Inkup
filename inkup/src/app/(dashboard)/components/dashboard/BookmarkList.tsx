'use client';

import { useToolStore } from '../../lib/store';
import Image from 'next/image';

export default function BookmarkList() {
  const { bookmarks } = useToolStore();

  if (bookmarks.length === 0) {
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {bookmarks.map((b, idx) => (
        <div
          key={idx}
          className="relative aspect-square rounded-xl overflow-hidden border border-[#2a2a2a] shadow"
        >
          <Image
            src={b.image}
            alt={`Bookmark ${idx}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
