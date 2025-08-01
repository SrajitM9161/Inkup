'use client';

import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

interface CameraCaptureProps {
  onCapture: (file: File, base64: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let stream: MediaStream;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
               console.log(err)
              console.warn('[CameraCapture] Video play failed:', err);
            });
          };
        }
      } catch (err) {
         console.log(err)
        toast.error('Unable to access camera');
        onCancel();
      }
    };

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [onCancel]);

  const capture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], 'captured.png', { type: 'image/png' });

        const base64 = canvas.toDataURL('image/png');
        localStorage.setItem('camera-image', base64);

        onCapture(file, base64);
        toast.success('Photo captured!');
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-full max-w-lg">
       
        <div className="rounded-xl overflow-hidden ">
          <video ref={videoRef} className="w-full h-auto" autoPlay muted playsInline />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onCancel}
            className="w-[48%] px-4 py-2 text-sm font-semibold border border-[#d0fe1f] text-[#d0fe1f] rounded hover:bg-[#d0fe1f] hover:text-black transition-all duration-200"
          >
             Cancel
          </button>
          <button
            onClick={capture}
            className="w-[48%] px-4 py-2 text-sm font-semibold border border-[#d0fe1f] text-[#d0fe1f] rounded hover:bg-[#d0fe1f] hover:text-black transition-all duration-200"
          >
             Capture
          </button>
        </div>
      </div>
    </div>
  );
}
