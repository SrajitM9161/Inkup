
'use client';
import { useRef, useState } from 'react';
import Modal from '../../ui/Modal';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useToolStore, useEditToolStore } from '../../../lib/store';
import CameraCapture from '../../../../components/CameraCapture';
import { ImagePlus, Camera } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setUserImage = useToolStore((s) => s.setUserImage);
  const setUploadedFile = useToolStore((s) => s.setUploadedFile);
  const setUploadModalOpen = useToolStore((s) => s.setUploadModalOpen);
  const setIsGenerating = useToolStore((s) => s.setIsGenerating);
  const clearImages = useEditToolStore((s) => s.clearImages);
  const setResultImages = useEditToolStore((s) => s.setResultImages);

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleUpload = async () => {
    if (!preview || !userFile) {
      toast.error('Please select or capture an image!');
      return;
    }
    setIsUploading(true);

    try {
      const base64 = preview.startsWith('blob:') ? await fileToBase64(userFile) : preview;
      // Important: clear outputs before setting new base to avoid flicker/race
      setIsGenerating(false);
      setResultImages([]);
      clearImages();
      setUserImage(base64);
      setUploadedFile(userFile);
      setUploadModalOpen(false);
      toast.success('Image uploaded!');
      onClose();
    } catch (e) {
      toast.error('Failed to process image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = (file: File, base64: string) => {
    setUserFile(file);
    setPreview(base64);
    setShowCamera(false);
    toast.success('Photo captured! Please confirm upload.');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="mx-auto max-w-sm px-0 text-center space-y-6">
        <div className="flex justify-center">
          <ImagePlus size={40} className="text-[#d0fe17]" />
        </div>
        <h2 className="text-xl font-semibold">Image Placement</h2>
        <p className="text-gray-400 text-sm">Add image and visualize tattoo – draw, erase, adjust.</p>

        <div className="space-y-2">
          {preview && (
            <div className="w-full">
              <Image src={preview} alt="Preview" width={300} height={300} className="object-contain max-h-48 mx-auto rounded" />
            </div>
          )}

          <div className="flex justify-center gap-2">
            <button onClick={() => inputRef.current?.click()} className="px-3 py-2 text-sm bg-[#D0FE17]/2 border border-[#D0FE17] text-[#D0FE17] rounded-md hover:bg-[#d0fe17] hover:text-black hover:font-semibold hover:border-transparent flex items-center gap-1">
              <ImagePlus size={16} />
              Upload Image
            </button>

            <button onClick={() => setShowCamera(true)} className="px-3 py-2 text-sm bg-[#D0FE17]/2 border border-[#D0FE17] text-[#D0FE17] rounded-md hover:bg-[#d0fe17] hover:text-black hover:font-semibold hover:border-transparent flex items-center gap-1">
              <Camera size={16} />
              Use Camera
            </button>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setUserFile(file);
                setPreview(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        <button onClick={handleUpload} disabled={!preview || isUploading} className="w-full mt-4 px-4 py-2 text-sm border border-[#D0FE17] text-[#D0FE17] rounded transition-all duration-200 hover:bg-[#D0FE17] hover:text-black hover:font-bold hover:border-transparent disabled:opacity-50">
          {isUploading ? 'Uploading...' : 'Confirm & Upload'}
        </button>
      </div>
      {showCamera && (
        <CameraCapture onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />
      )}
    </Modal>
  );
}
