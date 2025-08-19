'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import SwapCameraButton from './SwapCameraButton';

interface CameraCaptureProps {
  onCapture: (file: File, base64: string) => void;
  onCancel: () => void;
  // optional: preferred resolution
  preferredWidth?: number;
  preferredHeight?: number;
  preferredFrameRate?: number;
}

type CameraKind = 'user' | 'environment';

export default function CameraCapture({
  onCapture,
  onCancel,
  preferredWidth = 1280,
  preferredHeight = 720,
  preferredFrameRate = 30
}: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // stable ref for current stream
  const [availableVideoInputs, setAvailableVideoInputs] = useState<MediaDeviceInfo[]>([]);
  const [preferredKind, setPreferredKind] = useState<CameraKind>('user');
  const [isSwapping, setIsSwapping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usingDeviceId, setUsingDeviceId] = useState<string | null>(null);

  // Utility: stop stream tracks & clear ref
  const stopCurrentStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  }, []);

  // After we have permission we can access labels
  const updateDeviceList = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = devices.filter((d) => d.kind === 'videoinput');
      setAvailableVideoInputs(videoInputs);
    } catch (err) {
      console.warn('[CameraCapture] enumerateDevices error', err);
    }
  }, []);

  // Choose deviceId matching kind when possible
  const findDeviceIdForKind = useCallback(
    (kind: CameraKind) => {
      // prefer device label match (if available)
      const mobileLabels = {
        environment: ['back', 'rear', 'environment', 'world'],
        user: ['front', 'user']
      };

      // try labels first
      for (const device of availableVideoInputs) {
        const label = device.label.toLowerCase();
        if (mobileLabels[kind].some((kw) => label.includes(kw))) return device.deviceId;
      }

      // otherwise if only two cameras, pick the other one
      if (availableVideoInputs.length === 2) {
        // choose second if environment requested (simple heuristic)
        return availableVideoInputs[kind === 'environment' ? 1 : 0]?.deviceId ?? null;
      }

      return null;
    },
    [availableVideoInputs]
  );

  // Start camera using either deviceId or facingMode constraint (with ideals)
  const startCamera = useCallback(
    async (kind: CameraKind, deviceId: string | null = null) => {
      setLoading(true);
      try {
        stopCurrentStream();

        const videoConstraints: any = {
          width: { ideal: preferredWidth },
          height: { ideal: preferredHeight },
          frameRate: { ideal: preferredFrameRate }
        };

        if (deviceId) {
          videoConstraints.deviceId = { exact: deviceId };
        } else {
          // use facingMode as fallback. some browsers ignore it, so we prefer deviceId when available
          videoConstraints.facingMode = { ideal: kind };
        }

        const constraints: MediaStreamConstraints = {
          audio: false,
          video: videoConstraints
        };

        const s = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = s;

        // Now that we have permission, enumerate devices to populate labels
        await updateDeviceList();

        if (videoRef.current) {
          videoRef.current.srcObject = s;
          // iOS Safari requires play called after srcObject and user gesture often
          await videoRef.current.play().catch(() => {
            /* swallow play errors - most browsers allow autoplay when muted/playsinline */
          });
        }

        setUsingDeviceId(deviceId ?? null);
      } catch (err: any) {
        console.error('[CameraCapture] startCamera error', err);

        // If deviceId used and failed, try without deviceId (facingMode)
        if (deviceId) {
          toast('Requested camera failed, trying generic facing mode...', { icon: '⚠️' });
          return startCamera(kind, null);
        }

        // If we tried facingMode environment and failed, fallback to user
        if (kind === 'environment') {
          toast('Environment camera not available — switching to front camera', { icon: '📷' });
          setPreferredKind('user');
          return startCamera('user', null);
        }

        // unrecoverable
        toast.error('Unable to access camera. Check permissions or HTTPS.');
        onCancel();
      } finally {
        setLoading(false);
      }
    },
    [preferredWidth, preferredHeight, preferredFrameRate, stopCurrentStream, updateDeviceList, onCancel]
  );

  // Initialize: request permission & start
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // This will prompt for permission on many browsers. We intentionally request minimal constraints to get labels.
        // We call getUserMedia with facingMode user first to prompt permission, but won't use this stream long-term.
        await startCamera(preferredKind, null);
      } catch (err) {
        console.error('[CameraCapture] init error', err);
        if (mounted) {
          toast.error('Camera initialization failed.');
          onCancel();
        }
      }
    })();

    return () => {
      mounted = false;
      stopCurrentStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Swap camera: prefer using deviceId discovered, else toggle facingMode
  const swapCamera = useCallback(async () => {
    if (isSwapping) return;
    setIsSwapping(true);

    try {
      // choose intended next kind
      const nextKind: CameraKind = preferredKind === 'user' ? 'environment' : 'user';

      // attempt to find a deviceId for that kind
      const candidateDeviceId = findDeviceIdForKind(nextKind);

      // If we couldn't identify a deviceId but multiple inputs exist, pick one that's not current using deviceId
      let deviceIdToUse = candidateDeviceId;
      if (!deviceIdToUse && availableVideoInputs.length > 1) {
        // choose different deviceId than currently used
        const currentId = usingDeviceId;
        deviceIdToUse = availableVideoInputs.find((d) => d.deviceId !== currentId)?.deviceId ?? null;
      }

      // Start new camera
      await startCamera(nextKind, deviceIdToUse);
      setPreferredKind(nextKind);
    } catch (err) {
      console.warn('[CameraCapture] swapCamera failed', err);
      toast.error('Could not switch camera');
    } finally {
      setIsSwapping(false);
    }
  }, [isSwapping, preferredKind, findDeviceIdForKind, availableVideoInputs, usingDeviceId, startCamera]);

  // Capture image (handles front camera mirroring)
  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    // ensure video has dimensions
    const vw = video.videoWidth || preferredWidth;
    const vh = video.videoHeight || preferredHeight;

    const canvas = document.createElement('canvas');
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      toast.error('Unable to capture image (no canvas context).');
      return;
    }

    // detect if front camera is used (mirror). We'll flip horizontally if using user facing camera
    const isFront = preferredKind === 'user' || (usingDeviceId && (() => {
      // heuristics: device label may contain 'front' keyword
      const dev = availableVideoInputs.find((d) => d.deviceId === usingDeviceId);
      return !!(dev && dev.label.toLowerCase().includes('front'));
    })());

    if (isFront) {
      // flip horizontally so saved image is not mirrored
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    // Draw video into canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to blob and file
    canvas.toBlob((blob) => {
      if (!blob) {
        toast.error('Capture failed');
        return;
      }
      const file = new File([blob], `photo-${Date.now()}.png`, { type: 'image/png' });
      const base64 = canvas.toDataURL('image/png');

      try {
        // Save for quick preview or debugging
        try {
          localStorage.setItem('camera-image', base64);
        } catch {
          // ignore localStorage failures in privacy modes
        }
      } catch {}

      onCapture(file, base64);
    }, 'image/png');
  }, [onCapture, preferredKind, usingDeviceId, availableVideoInputs, preferredWidth, preferredHeight]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {

        stopCurrentStream();
      } else {

        startCamera(preferredKind, usingDeviceId ?? null).catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [preferredKind, startCamera, usingDeviceId, stopCurrentStream]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="relative bg-[#1e1e1e] p-4 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-auto rounded-xl bg-black"
            autoPlay
            muted
            playsInline
            // Important for iOS Safari to allow camera inside iframe/modal
            // Also ensure no controls so playback is silent autoplayable
          />

          {/* small overlay showing which camera */}
          <div className="absolute top-3 left-3 bg-black/40 text-white text-xs px-2 py-1 rounded">
            {loading ? 'Starting...' : preferredKind === 'user' ? 'Front Camera' : 'Back Camera'}
          </div>
        </div>

        <div className="flex justify-between gap-3 mt-4">
          <button
            onClick={onCancel}
            aria-label="Cancel camera"
            className="flex-1 px-4 py-2 text-sm font-semibold border border-[#d0fe1f] text-[#d0fe1f] rounded hover:bg-[#d0fe1f] hover:text-black transition-all duration-150"
          >
            Cancel
          </button>

          <button
            onClick={capture}
            aria-label="Capture photo"
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm font-semibold bg-[#d0fe1f] text-black rounded hover:opacity-90 transition-all duration-150"
          >
            Capture
          </button>
        </div>

        <div className="mt-3 flex items-center justify-center">
          {availableVideoInputs.length > 1 ? (
            <SwapCameraButton onClick={swapCamera} disabled={isSwapping || loading} />
          ) : (
            <p className="text-center text-gray-400 text-sm">Only one camera detected</p>
          )}
        </div>
      </div>
    </div>
  );
}
