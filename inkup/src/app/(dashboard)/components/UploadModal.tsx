'use client';

import { useState, useRef } from 'react';
import { useToolStore } from '../lib/store';
import { X, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { uploadImages } from '../../API/Api';
interface Props {
  onClose: () => void;
}

export default function UploadModal({ onClose }: Props) {
  const { setSelectedImage, setCustomItemImage } = useToolStore();

  const [userImg, setUserImg] = useState<string | null>(null);
  const [itemImg, setItemImg] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [itemFile, setItemFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const userInputRef = useRef<HTMLInputElement>(null);
  const itemInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'user' | 'item'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (type === 'user') {
          setUserImg(reader.result);
          setUserFile(file);
        } else {
          setItemImg(reader.result);
          setItemFile(file);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!userFile || !itemFile) {
      toast.error('Both images are required!');
      return;
    }

    const token = localStorage.getItem('token');
    setLoading(true);

    try {
      const result = await uploadImages(userFile, itemFile, token);

      setSelectedImage(result.data.userImageUrl);
      setCustomItemImage(result.data.itemImageUrl);
      toast.success('Uploaded and saved!');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center px-4">
      <div className="bg-[#0B0B0B] border border-[#2F2F2F] w-full max-w-sm p-6 rounded-xl relative text-center shadow-lg">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
          onClick={onClose}
          disabled={loading}
        >
          <X size={22} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-[#00E5FF1A] p-4 rounded-lg">
            <ImagePlus className="text-cyan-400" size={40} />
          </div>
        </div>

        <h2 className="text-white text-2xl font-semibold mb-2">Image placement</h2>
        <p className="text-gray-400 text-sm mb-6 px-4">
          Add image and visualize tattoo – just by draw, erase, adjust and apply your touch
        </p>

        {/* Hidden Inputs */}
        <input
          type="file"
          accept="image/*"
          ref={userInputRef}
          onChange={(e) => handleFileChange(e, 'user')}
          className="hidden"
        />
        <input
          type="file"
          accept="image/*"
          ref={itemInputRef}
          onChange={(e) => handleFileChange(e, 'item')}
          className="hidden"
        />

        {/* Upload Buttons */}
        <div className="flex justify-center gap-4 mb-4 flex-wrap">
          <button
            onClick={() => userInputRef.current?.click()}
            className="border border-cyan-400 text-cyan-400 px-5 py-2 rounded-full text-sm font-medium hover:bg-cyan-400 hover:text-black transition"
            disabled={loading}
          >
            Upload Image
          </button>
          <button
            onClick={() => itemInputRef.current?.click()}
            className="border border-cyan-400 text-cyan-400 px-5 py-2 rounded-full text-sm font-medium hover:bg-cyan-400 hover:text-black transition"
            disabled={loading}
          >
            Select Prebuild
          </button>
        </div>

        {/* Image Preview */}
        {(userImg || itemImg) && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            {userImg && (
              <Image
                src={userImg}
                alt="user"
                width={100}
                height={100}
                className="rounded-md mx-auto"
              />
            )}
            {itemImg && (
              <Image
                src={itemImg}
                alt="item"
                width={100}
                height={100}
                className="rounded-md mx-auto"
              />
            )}
          </div>
        )}

        {/* Final Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-2 w-full py-2 bg-[#63F5FF] text-black font-semibold rounded-md hover:bg-[#56e0e9] transition"
        >
          {loading ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
