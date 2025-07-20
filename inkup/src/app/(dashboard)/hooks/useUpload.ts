import { useToolStore } from '../lib/store';
import toast from 'react-hot-toast';

export const useUpload = () => {
  const {
    setSelectedImage,
    setCustomItemImage,
    setUploadedFile,
    setUploadModalOpen,
  } = useToolStore();

  const handleUpload = async (file: File) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setSelectedImage(result);
      setCustomItemImage(result);
      setUploadedFile(file);
      setUploadModalOpen(false);
      toast.success('Image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  return { handleUpload };
};
