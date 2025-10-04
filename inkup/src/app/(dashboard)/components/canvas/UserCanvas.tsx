'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ReactSketchCanvas, ReactSketchCanvasRef } from 'react-sketch-canvas'
import { useToolStore, useEditToolStore } from '../../lib/store'
import { Trash2, Maximize2, X, Pen, Download } from 'lucide-react'
import Loader from '../ui/CrazyLoader'
import toast from 'react-hot-toast'

interface UserCanvasProps {
  canvasRef: React.RefObject<ReactSketchCanvasRef | null>
}

export default function UserCanvas({ canvasRef }: UserCanvasProps) {
  const {
    userImage,
    tool,
    strokeWidth,
    isGenerating,
    setIsGenerating,
    clearPersistedImages,
    setUserImage,
    segmentationMode,
    segmentationPoints,
    segmentationMask,
    addSegmentationPoint,
    clearSegmentationPoints,
    setSegmentationMask,
    isSegmenting,
    setIsSegmenting,
  } = useToolStore()
  const { resultImages, clearImages } = useEditToolStore()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [displayImage, setDisplayImage] = useState<string | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const segmentationCanvasRef = useRef<HTMLCanvasElement>(null)
  const workerRef = useRef<Worker | null>(null)
  const [modelReady, setModelReady] = useState(false)

  const latest = useMemo(
    () => (resultImages.length ? resultImages[resultImages.length - 1] : null),
    [resultImages]
  )

  const shownRef = useRef<string | null>(null)

  useEffect(() => {
    if (segmentationMode) {
      try {
        workerRef.current = new Worker(
          new URL('../../../workers/SegmentationWorker.ts', import.meta.url),
          { type: 'module' }
        );

        workerRef.current.onmessage = (event) => {
          const { status, result, message, progress } = event.data;

          switch (status) {
            case 'initialized':
              toast.loading('Initializing segmentation model...');
              workerRef.current?.postMessage({ type: 'init' });
              break;
            case 'loading':
              toast.loading(message, { duration: 60000, id: 'model-loading' });
              break;
            case 'progress':
              console.log('[UserCanvas] Progress:', progress);
              if (progress && progress.status === 'progress' && progress.progress) {
                const percent = Math.round(progress.progress);
                if (percent % 5 === 0) {
                  toast.loading(`Loading model: ${percent}%`, { duration: 60000, id: 'model-loading' });
                }
              }
              break;
            case 'ready':
              console.log('[UserCanvas] ✓✓✓ Model ready ✓✓✓');
              setModelReady(true);
              toast.dismiss();
              toast.success('Segmentation model ready! Click on image to segment.', { 
                duration: 4000,
                icon: '✂️' 
              });
              break;
            case 'complete':
              handleSegmentationResult(result);
              setIsSegmenting(false);
              toast.dismiss();
              toast.success('Segmentation complete!');
              break;
            case 'error':
              toast.dismiss();
              toast.error(`Error: ${message}`);
              setIsSegmenting(false);
              break;
          }
        };

        workerRef.current.onerror = (error) => {
          toast.error('Worker initialization failed');
        };
      } catch (error) {
        toast.error('Failed to initialize segmentation');
      }

      return () => {
        workerRef.current?.terminate();
        workerRef.current = null;
        setModelReady(false);
      };
    }
  }, [segmentationMode]);

  useEffect(() => {
    const src = latest ?? userImage ?? null;
    if (!src) {
      setDisplayImage(null);
      shownRef.current = null;
      setImageLoaded(false);
      return;
    }

    if (src !== shownRef.current) {
      setImageLoaded(false);
      const img = new Image();
      img.onload = () => {
        const stillRelevantSrc = useEditToolStore.getState().resultImages.slice(-1)[0] ?? useToolStore.getState().userImage;
        if (img.src === stillRelevantSrc) {
            shownRef.current = src;
            setDisplayImage(src);
            setImageLoaded(true);
            setIsGenerating(false);
            toast.dismiss();
        }
      };
      img.onerror = () => {
        setImageLoaded(true);
        setIsGenerating(false);
        toast.error('Failed to load image.');
      };
      img.src = src;
    }
  }, [userImage, latest, setIsGenerating]);

  useEffect(() => {
    if (segmentationMode && segmentationCanvasRef.current && displayImage) {
      console.log('[UserCanvas] Drawing segmentation overlay');
      const canvas = segmentationCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        segmentationPoints.forEach((point, idx) => {
          ctx.fillStyle = point.type === 'positive' ? '#00FF00' : '#FF0000';
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 8, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
        });

        if (segmentationMask) {
          ctx.globalAlpha = 0.5;
          ctx.putImageData(segmentationMask, 0, 0);
          ctx.globalAlpha = 1.0;
        }
      };
      img.src = displayImage;
    }
  }, [segmentationMode, segmentationPoints, segmentationMask, displayImage]);

  useEffect(() => {
    if (userImage) {
        if (latest && latest !== userImage) {
            clearImages();
        }
    }
  }, [userImage, latest, clearImages]);

  const handleSegmentationClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!segmentationMode || !modelReady || isSegmenting) {
      console.log('[UserCanvas] Click ignored:', { segmentationMode, modelReady, isSegmenting });
      return;
    }

    const canvas = segmentationCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const pointType = e.shiftKey ? 'negative' : 'positive';
    
    console.log('[UserCanvas] Click detected:', { x, y, pointType, shiftKey: e.shiftKey });
    
    addSegmentationPoint({ x, y, type: pointType });
    
    performSegmentation([...segmentationPoints, { x, y, type: pointType }]);
  };

  const performSegmentation = (points: typeof segmentationPoints) => {
    if (!displayImage || points.length === 0 || !modelReady || !workerRef.current) {
      console.log('[UserCanvas] Segmentation prerequisites not met:', {
        hasImage: !!displayImage,
        pointsCount: points.length,
        modelReady,
        hasWorker: !!workerRef.current,
      });
      return;
    }

    setIsSegmenting(true);
    toast.loading('Segmenting...');

    const coords = points.map((p) => [p.x, p.y]);
    const labels = points.map((p) => (p.type === 'positive' ? 1 : 0));


    workerRef.current.postMessage({
      type: 'segment',
      data: {
        image: displayImage,
        points: coords,
        labels: labels,
      },
    });
  };

  const handleSegmentationResult = (result: any) => {
    
    const canvas = document.createElement('canvas');
    canvas.width = result.imageSize.width;
    canvas.height = result.imageSize.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bestMaskIndex = result.scores.indexOf(Math.max(...result.scores));
    
    const maskInfo = result.masks[bestMaskIndex];
    const maskData = maskInfo.data;
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    
    for (let i = 0; i < maskData.length; i++) {
      const value = maskData[i] > 0 ? 255 : 0;
      imageData.data[i * 4] = 0;    
      imageData.data[i * 4 + 1] = 255;
      imageData.data[i * 4 + 2] = 0;   
      imageData.data[i * 4 + 3] = value; 
    }

    setSegmentationMask(imageData);
  };

const handleDownloadSegmentation = () => {
  if (!segmentationMask || !displayImage) {
    toast.error('No segmentation to download');
    return;
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const img = new Image();
  img.crossOrigin = 'anonymous'; 
  
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
    
    maskCtx.putImageData(segmentationMask, 0, 0);
    
    ctx.globalCompositeOperation = 'destination-in';
    ctx.drawImage(maskCanvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = 'segmented-image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    
    toast.success('Downloaded segmented image!');
  };
  
  img.onerror = () => {
    toast.error('Failed to load image for download');
    console.error('[UserCanvas] Image load error during download');
  };
  
  img.src = displayImage;
};


  const handleClearAll = () => {
    canvasRef.current?.resetCanvas()
    clearPersistedImages()
    clearImages()
    if (segmentationMode) {
      clearSegmentationPoints();
    }
  }

  const handleSetAsBase = () => {
    const currentImageOnCanvas = shownRef.current

    if (currentImageOnCanvas) {
      if (userImage === currentImageOnCanvas) {
        toast('This is already the base image.')
        return
      }
      
      setUserImage(currentImageOnCanvas)
      clearImages()

      toast.success('Latest output set as base image!')
    }
  }

  return (
    <>
      <div className="relative w-[280px] h-[420px] md:w-[360px] md:h-[540px] lg:w-[280px] lg:h-[420px] rounded-[20px] overflow-hidden border border-[#333] shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-md">
        <div className="absolute top-2 right-2 z-30 flex flex-col gap-2">
          <button
            onClick={handleClearAll}
            className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
          {segmentationMode && segmentationMask && (
            <button
              onClick={handleDownloadSegmentation}
              className="bg-[#D0FE17] text-black p-1 rounded hover:bg-[#D0FE17]/80"
              title="Download Segmented Image"
            >
              <Download size={18} />
            </button>
          )}
          <button
            onClick={() => setIsFullscreen(true)}
            className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
            title="Fullscreen"
          >
            <Maximize2 size={18} />
          </button>
        </div>

        {displayImage && !segmentationMode && (
          <div className="absolute top-2 left-2 z-30">
            <button
              onClick={handleSetAsBase}
              className="bg-[#222] text-white p-1 rounded hover:bg-[#333]"
              title="Set as Base Image"
            >
              <Pen size={18} />
            </button>
          </div>
        )}

        <div className="absolute inset-0">
          {displayImage && (
            <>
              <img
                src={displayImage}
                alt="Base"
                className="absolute w-full h-full object-contain z-0 pointer-events-none"
                draggable={false}
              />
              {segmentationMode ? (
                <canvas
                  ref={segmentationCanvasRef}
                  className="absolute w-full h-full object-contain z-20 cursor-crosshair"
                  onClick={handleSegmentationClick}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    console.log('[UserCanvas] Right click detected');
                  }}
                />
              ) : (
                <ReactSketchCanvas
                  ref={canvasRef}
                  width="100%"
                  height="100%"
                  strokeWidth={strokeWidth}
                  strokeColor={tool === 'pen' ? '#ff3366' : '#ffffff'}
                  canvasColor="transparent"
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 20 }}
                />
              )}
            </>
          )}
        </div>

        {(isGenerating || isSegmenting || (!imageLoaded && (latest || userImage))) && (
          <div className="absolute inset-0 z-50 bg-black/50 flex flex-col items-center justify-center">
            <Loader />
            <p className="text-sm text-white mt-3 animate-pulse">
              {isSegmenting ? 'Segmenting Image…' : 'Generating Your Image…'}
            </p>
          </div>
        )}

        {segmentationMode && !modelReady && (
          <div className="absolute bottom-2 left-2 right-2 z-30 bg-black/90 p-3 rounded text-xs text-white">
            <p className="mb-2 font-semibold text-[#D0FE17]">⏳ Model loading...</p>
            <p className="text-gray-400 text-[10px]">This may take 30-60 seconds on first load.</p>
            <p className="text-gray-400 text-[10px]">Check browser console for progress.</p>
          </div>
        )}

        {segmentationMode && modelReady && (
          <div className="absolute bottom-2 left-2 right-2 z-30 bg-black/70 p-2 rounded text-xs text-white border border-[#D0FE17]/30">
            <p className="font-semibold text-[#D0FE17] mb-1">✓ Ready to segment!</p>
            <p className="mt-1">• <span className="text-green-400">Click</span>: Add include point</p>
            <p>• <span className="text-red-400">Shift+Click</span>: Add exclude point</p>
            <p className="text-gray-400 mt-1">Points: {segmentationPoints.length}</p>
          </div>
        )}
      </div>
      
      {isFullscreen && displayImage && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={displayImage}
              alt="Base"
              className="absolute w-full h-full object-contain pointer-events-none"
              draggable={false}
            />

            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleClearAll}
                className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
              >
                <Trash2 size={20} />
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
              >
                <X size={20} />
              </button>
            </div>

            {!segmentationMode && (
              <div className="absolute top-4 left-4">
                <button
                  onClick={handleSetAsBase}
                  className="bg-[#222] text-white p-2 rounded-full hover:bg-[#333]"
                  title="Set as Base Image"
                >
                  <Pen size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
