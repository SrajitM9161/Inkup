'use client';

import { useToolStore } from '../lib/store';
import Image from 'next/image';
import { Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function BookmarkList() {
  const {
    bookmarks,
    setSelectedImage,
    removeBookmark,
  } = useToolStore();

  if (!bookmarks.length) return null;

  return (
    <section className="w-full max-w-6xl mx-auto mt-10 px-6">
      <h2 className="text-2xl font-bold text-white mb-6">📌 Your Bookmarks</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {bookmarks.map((bookmark, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedImage(bookmark.image)}
          >
            <Image
              src={bookmark.image}
              alt={`bookmark-${idx}`}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />

            {/* Tag */}
            {bookmark.tag && (
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 via-black/30 to-transparent text-xs text-white font-medium px-3 py-2 backdrop-blur-sm">
                {bookmark.tag}
              </div>
            )}

            {/* Timestamp */}
            {bookmark.timestamp && (
              <div className="absolute top-2 left-2 text-[10px] bg-black/60 text-white px-2 py-[2px] rounded-full">
                {formatDistanceToNow(new Date(bookmark.timestamp), { addSuffix: true })}
              </div>
            )}

            {/* Delete */}
            <button
              className="absolute top-2 right-2 bg-black/60 hover:bg-red-600 p-1 rounded-full text-white transition"
              onClick={(e) => {
                e.stopPropagation();
                removeBookmark(idx);
              }}
              title="Remove Bookmark"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
