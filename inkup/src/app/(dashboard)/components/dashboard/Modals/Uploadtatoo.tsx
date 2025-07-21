'use client';

import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore } from '../../../lib/store';
import { uploadItemImage } from '../../../../API/Api';
import { ImagePlus } from 'lucide-react';

interface ItemUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ItemUploadModal({ isOpen, onClose }: ItemUploadModalProps) {
  const [itemFile, setItemFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setItemImage = useToolStore((s) => s.setItemImage);

  const handleUpload = async () => {
    if (!itemFile) {
      toast.error('Please select an item image!');
      return;
    }

    try {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setItemImage(base64);
        toast.success('Item image uploaded!');
        onClose();

        try {
          const result = await uploadItemImage(itemFile);
          console.log('[DEBUG] Uploaded to server:', result);
          toast.success('Item image also saved to server!');
        } catch (apiErr) {
          console.error('[DEBUG] Item Upload API Error:', apiErr);
          toast.error('Saved locally but failed to upload to server');
        }
      };

      reader.readAsDataURL(itemFile);
    } catch (error) {
      console.error('[DEBUG] Upload Error:', error);
      toast.error('Error uploading item image!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full space-y-4 text-center">
        <h2 className="text-xl font-semibold">Upload Item</h2>
        <p className="text-sm text-gray-400">Upload an item image to place or design with.</p>

        {/* Preview */}
        {itemFile && (
          <Image
            src={URL.createObjectURL(itemFile)}
            alt="Selected item"
            width={300}
            height={300}
            className="mx-auto object-contain max-h-48 rounded"
          />
        )}

        {/* Upload Button */}
        <div className="flex justify-center">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 text-sm bg-cyan-400 text-black rounded hover:bg-cyan-300 flex items-center gap-1"
          >
            <ImagePlus size={16} />
            Upload Image
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setItemFile(file);
              }
            }}
          />
        </div>

        {/* Confirm Upload */}
        <button
          onClick={handleUpload}
          disabled={!itemFile || isUploading}
          className="w-full mt-2 px-4 py-2 text-sm border border-cyan-400 text-cyan-400 rounded hover:bg-cyan-400 hover:text-black transition disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Confirm & Upload'}
        </button>
      </div>
    </Modal>
  );
}
