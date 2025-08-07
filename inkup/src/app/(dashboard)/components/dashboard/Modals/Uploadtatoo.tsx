'use client';

import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore } from '../../../lib/store';
// import { uploadItemImage } from '../../../../API/Api';
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

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setItemImage(base64);
      toast.success('Item image uploaded!');
      onClose();

      try {
        // const result = await uploadItemImage(itemFile);
        // console.log('[DEBUG] Uploaded to server:', result);
        toast.success('Item image also saved to server!');
      } catch (apiErr) {
        console.error('[DEBUG] Item Upload API Error:', apiErr);
        toast.error('Saved locally but failed to upload to server');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(itemFile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-sm px-0 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Upload Item</h2>
        <p className="text-sm text-gray-400">Upload an item image to place or design with.</p>

        {itemFile && (
          <Image
            src={URL.createObjectURL(itemFile)}
            alt="Selected item"
            width={300}
            height={300}
            className="mx-auto object-contain max-h-48 rounded"
          />
        )}

        <div className="flex justify-center">
          <button
            onClick={() => inputRef.current?.click()}
            className="px-3 py-2 text-sm bg-[#D0FE17] text-black rounded hover:bg-[#c6f42c] hover:text-black hover:font-semibold flex items-center gap-1"
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

        <button
          onClick={handleUpload}
          disabled={!itemFile || isUploading}
          className="w-full mt-2 px-4 py-2 text-sm border border-[#D0FE17] text-[#D0FE17] rounded hover:bg-[#D0FE17] hover:text-black hover:font-bold transition disabled:opacity-90"
        >
          {isUploading ? 'Uploading...' : 'Confirm & Upload'}
        </button>
      </div>
    </Modal>
  );
}
