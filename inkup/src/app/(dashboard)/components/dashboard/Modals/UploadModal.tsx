'use client';

import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore } from '../../../lib/store';
import { uploadUserImage } from '../../../../API/Api'; 

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Zustand actions
  const setSelectedImage = useToolStore((s) => s.setSelectedImage);
  const setCustomItemImage = useToolStore((s) => s.setCustomItemImage);
  const setUploadedFile = useToolStore((s) => s.setUploadedFile);
  const setUploadModalOpen = useToolStore((s) => s.setUploadModalOpen);

  const handleUpload = async () => {
    if (!userFile) {
      toast.error('Please select a user image!');
      return;
    }

    try {
      setIsUploading(true);

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        // ✅ 1. Zustand updates
        setSelectedImage(base64);        // canvas
        setCustomItemImage(base64);      // preview
        setUploadedFile(userFile);       // file object
        setUploadModalOpen(false);       // Zustand modal close
        toast.success('Image uploaded locally!');
        onClose();                       // Local modal close

        // ✅ 2. Upload to backend
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('JWT token missing!');

          const result = await uploadUserImage(userFile, token);
          console.log('[DEBUG] Uploaded to server:', result);
          toast.success('Image also saved to server!');
        } catch (apiErr) {
          console.error('[DEBUG] Server Upload Error:', apiErr);
          toast.error('Saved locally but failed to upload to server');
        }
      };

      reader.readAsDataURL(userFile);
    } catch (error) {
      console.error('[DEBUG] Upload Error:', error);
      toast.error('Error uploading image!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full space-y-4">
        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setUserFile(file);
              console.log('[DEBUG] File selected:', file.name);
            }
          }}
        />

        {/* Drop Zone */}
        <div
          onClick={() => inputRef.current?.click()}
          className="h-60 w-full flex items-center justify-center border border-dashed border-white cursor-pointer rounded-lg"
        >
          {userFile ? (
            <Image
              src={URL.createObjectURL(userFile)}
              alt="Selected image"
              width={300}
              height={300}
              className="object-contain max-h-full max-w-full rounded"
            />
          ) : (
            <p className="text-white">Click to upload an image</p>
          )}
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!userFile || isUploading}
          className="w-full bg-white text-black rounded-lg py-2 font-semibold hover:opacity-80 transition"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </Modal>
  );
}
