'use client';

import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore } from '../../../lib/store';
import { uploadItemImage } from '../../../../API/Api';

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

        // Local Zustand update
        setItemImage(base64);
        toast.success('Item image uploaded!');
        onClose();

        // Upload to backend API
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
      <div className="w-full space-y-4">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setItemFile(file);
              console.log('[DEBUG] Item File selected:', file.name);
            }
          }}
        />
        <div
          onClick={() => inputRef.current?.click()}
          className="h-60 w-full flex items-center justify-center border border-dashed border-white cursor-pointer rounded-lg"
        >
          {itemFile ? (
            <Image
              src={URL.createObjectURL(itemFile)}
              alt="Selected item image"
              width={300}
              height={300}
              className="object-contain max-h-full max-w-full rounded"
            />
          ) : (
            <p className="text-white">Click to upload an item image</p>
          )}
        </div>
        <button
          onClick={handleUpload}
          disabled={!itemFile || isUploading}
          className="w-full bg-white text-black rounded-lg py-2 font-semibold hover:opacity-80 transition"
        >
          {isUploading ? 'Uploading...' : 'Upload Item'}
        </button>
      </div>
    </Modal>
  );
}
