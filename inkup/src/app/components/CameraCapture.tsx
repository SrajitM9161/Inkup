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

          // Wait for video metadata before playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err) => {
              console.warn('[CameraCapture] Video play failed:', err);
            });
          };
        }
      } catch (err) {
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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-md space-y-4">
        <video ref={videoRef} className="w-full rounded-lg" autoPlay muted playsInline />
        <div className="flex justify-between">
          <button
            onClick={capture}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Capture
          </button>
          <button
            onClick={onCancel}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
