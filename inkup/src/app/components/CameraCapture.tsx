'use client';

import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import SwapCameraButton from './SwapCameraButton';

interface CameraCaptureProps {
  onCapture: (file: File, base64: string) => void;
  onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [canSwapCamera, setCanSwapCamera] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);

  // Detect if there are multiple video inputs
  const detectAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((device) => device.kind === 'videoinput');
      setCanSwapCamera(videoInputs.length > 1);
    } catch (error) {
      console.warn('[CameraCapture] Could not detect cameras', error);
      setCanSwapCamera(false);
    }
  };

  // Start the camera with selected facing mode
  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: mode },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);

      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }

      setStream(newStream);
    } catch (err) {
      console.warn(`[CameraCapture] Failed to access camera with mode '${mode}', falling back...`, err);

      if (mode === 'environment') {
        try {
          const fallbackStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = fallbackStream;
            await videoRef.current.play();
          }

          stream?.getTracks().forEach((track) => track.stop());

          setFacingMode('user');
          setStream(fallbackStream);

          toast('Environment camera not found. Using front camera instead.', {
            icon: '📷',
          });
        } catch (fallbackError) {
          console.error('[CameraCapture] Fallback failed:', fallbackError);
          toast.error('Unable to access camera');
          onCancel();
        }
      } else {
        toast.error('Unable to access camera');
        onCancel();
      }
    }
  };

  // Load camera when facing mode changes
  useEffect(() => {
    detectAvailableCameras();

    // Add delay to avoid camera re-init glitches
    const delay = setTimeout(() => {
      startCamera(facingMode);
    }, 200); // Adjust this delay if needed

    return () => {
      clearTimeout(delay);
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [facingMode]);

  // Debounced camera swap
  const swapCamera = () => {
    if (isSwapping) return;
    setIsSwapping(true);

    // Stop current stream before switching
    stream?.getTracks().forEach((track) => track.stop());

    setTimeout(() => {
      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
      setIsSwapping(false);
    }, 300); // Small delay ensures smoother transition
  };

  // Capture photo
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
      <div className="relative bg-[#1e1e1e] p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <video ref={videoRef} className="w-full h-auto rounded-xl" autoPlay muted playsInline />

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

        {canSwapCamera && <SwapCameraButton onClick={swapCamera} />}
      </div>
    </div>
  );
}
