'use client'

import Image from 'next/image'
import { Maximize2, Pen } from 'lucide-react'

interface ImageCardProps {
  img?: string
  showControls?: boolean
  onMaximize?: () => void
  onSetAsBase?: () => void
  onClick?: () => void
}

export default function ImageCard({
  img,
  showControls = false, 
  onMaximize,
  onSetAsBase,
  onClick,
}: ImageCardProps) {
  const handleMaximizeClick = (e: React.MouseEvent) => {
    e.stopPropagation() 
    onMaximize && onMaximize()
  }

  const handleSetAsBaseClick = (e: React.MouseEvent) => {
    e.stopPropagation() 
    onSetAsBase && onSetAsBase()
  }

  if (!img) {
    return (
      <div
        className="cursor-pointer overflow-hidden hover:scale-[1.02] transition flex items-center justify-center border-2 border-transparent"
        onClick={onClick}
      >
        <div className="w-full h-[150px] flex items-center justify-center border-dashed border-green-500 text-green-500 rounded-md hover:bg-green-950/30 transition">
          + Add tattoo
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative cursor-pointer overflow-hidden hover:scale-[1.02] transition flex items-center justify-center border-2 border-transparent"
      draggable={true}
      onDragStart={(e) => {
        e.dataTransfer.setData('image', img)
      }}
      onClick={!showControls ? onClick : undefined}
    >
      <Image
        src={img}
        alt="Catalog"
        width={300}
        height={300}
        className="w-full h-[140px] object-cover"
      />

      {showControls && (
        <div className="absolute top-1 right-1 flex gap-1">
          <button
            onClick={handleSetAsBaseClick}
            className="bg-[#222]/70 text-white p-1 rounded-md hover:bg-[#333]"
            title="Set as Base Image"
          >
            <Pen size={16} />
          </button>
          <button
            onClick={handleMaximizeClick}
            className="bg-[#222]/70 text-white p-1 rounded-md hover:bg-[#333]"
            title="Maximize"
          >
            <Maximize2 size={16} />
          </button>
        </div>
      )}
    </div>
  )
}