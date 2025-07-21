'use client';

import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore } from '../../../lib/store';
import { uploadUserImage } from '../../../../API/Api';
import CameraCapture from '../../../../components/CameraCapture'; 

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false); // ✅ New state
  const inputRef = useRef<HTMLInputElement | null>(null);

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

        // Local preview + Zustand
        setSelectedImage(base64);
        setCustomItemImage(base64);
        setUploadedFile(userFile);
        setUploadModalOpen(false);
        toast.success('Image uploaded locally!');
        onClose();

        // Upload to backend
        try {
          const result = await uploadUserImage(userFile);
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

  // ✅ Called by CameraCapture when photo is taken
  const handleCameraCapture = (file: File, base64: string) => {
    setUserFile(file);
    setSelectedImage(base64);
    setCustomItemImage(base64);
    setUploadedFile(file);
    setShowCamera(false);
    toast.success('Photo captured and ready!');
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
              setUserFile(file);
              console.log('[DEBUG] File selected:', file.name);
            }
          }}
        />
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

        <button
          onClick={handleUpload}
          disabled={!userFile || isUploading}
          className="w-full bg-white text-black rounded-lg py-2 font-semibold hover:opacity-80 transition"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        <button
          onClick={() => setShowCamera(true)}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:opacity-80 transition"
        >
          Use Camera
        </button>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onCancel={() => setShowCamera(false)}
        />
      )}
    </Modal>
  );
}
