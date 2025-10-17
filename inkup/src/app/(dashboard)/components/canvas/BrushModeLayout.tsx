'use client';

import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useToolStore } from '../../lib/store';
import BrushCanvas, { BrushCanvasHandle, ExportMethod } from './BrushCanvas';
import BrushControls from './BrushControls';
import { Download, Save, MessageSquarePlus, ArrowRight } from 'lucide-react';
import PromptBox from '../prompt/PromptBox';
import { saveProject } from '../../../api/api';
import { ProjectFile, Stroke } from '../types/canvas';
import ConfirmExitModal from '../dashboard/Modals/ConfirmExitModal'; 

export default function BrushModeLayout({
  initialProject,
}: {
  initialProject?: ProjectFile | null;
}) {
  const { userImage, setCanvasMode, setUserImage, setPreviewImage, setActiveProject } = useToolStore();
  const [promptOpen, setPromptOpen] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const brushCanvasRef = useRef<BrushCanvasHandle>(null);
  const [imageRect, setImageRect] = useState<DOMRect | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [liveCanvasImage, setLiveCanvasImage] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmExitModal, setShowConfirmExitModal] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = ''; 
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    const imgElement = imageRef.current;
    if (!imgElement) return;
    const handleResize = () => { setImageRect(imgElement.getBoundingClientRect()); };
    const observer = new ResizeObserver(handleResize);
    observer.observe(imgElement);
    imgElement.addEventListener('load', handleResize);
    if (imgElement.complete) { handleResize(); }
    return () => {
      observer.disconnect();
      imgElement.removeEventListener('load', handleResize);
    };
  }, [userImage]);

  const handleExport = (method: ExportMethod = 'pixi') => {
    if (brushCanvasRef.current) {
      brushCanvasRef.current.exportImage(method);
    } else {
      toast.error('Canvas is not yet ready for export.');
    }
  };
  
  const handleSave = async () => {
    if (!brushCanvasRef.current || isSaving) return;
    setIsSaving(true);
    toast.loading('Saving your project...');
    try {
      const projectDataPartial = brushCanvasRef.current.getProjectData();
      if (!projectDataPartial || !projectDataPartial.baseImageSrc || !projectDataPartial.projectData) {
        throw new Error('Could not get complete project data from canvas.');
      }
      const previewImageBase64 = await brushCanvasRef.current.exportToBase64();
      if (!previewImageBase64) { throw new Error('Failed to generate preview image.'); }
      
      const baseImageBase64 = projectDataPartial.baseImageSrc;

      const response = await saveProject(projectDataPartial, previewImageBase64, baseImageBase64);
      
      const savedProjectResponse = response.data;
      toast.dismiss();
      toast.success('Project saved!');
      
      const updatedProjectFile: ProjectFile = {
          ...(initialProject || {}), ...projectDataPartial,
          id: savedProjectResponse._id || initialProject?.id,
          baseImageSrc: projectDataPartial.baseImageSrc,
          projectData: projectDataPartial.projectData,
          previewImageUrl: savedProjectResponse.previewImageUrl,
      };
      setActiveProject(updatedProjectFile);
      setPreviewImage(updatedProjectFile.previewImageUrl || null);
      setIsDirty(false);
    } catch (error) {
      console.error("SAVE FAILED (in catch block):", error);
      toast.dismiss();
      toast.error('Could not save the project.', { id: 'save-error-toast' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenPromptBox = async () => {
    if (!brushCanvasRef.current) { toast.error("Canvas is not ready."); return; }
    toast.loading("Preparing canvas for editing...");
    const image = await brushCanvasRef.current.exportToBase64();
    toast.dismiss();
    if (image) {
      setLiveCanvasImage(image);
      setPromptOpen(true);
    } else {
      toast.error("Could not export canvas image.");
    }
  };

  const closePromptBox = () => {
    setPromptOpen(false);
    setLiveCanvasImage(null);
  };
  
  const handleExit = () => {
    if (isDirty) {
      setShowConfirmExitModal(true);
    } else {
      setCanvasMode(false);
    }
  };

  const confirmAndExit = () => {
    setCanvasMode(false);
    setShowConfirmExitModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#181818] flex flex-col">
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleExport('pixi')}
            className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
            title="Export Image (Recommended)"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed ${
              isDirty 
                ? 'border-yellow-400 hover:bg-yellow-400/20'
                : 'border-[#333] hover:bg-[#D0FE17] hover:text-black'
            }`}
            title="Save to My Generations"
          >
            <Save size={20} />
            <span>{isSaving ? 'Saving...' : `Save${isDirty ? '*' : ''}`}</span>
          </button>
          <button
            onClick={handleOpenPromptBox}
            className="flex items-center gap-2 px-3 py-2 bg-[#1A1A1A] border border-[#333] text-white rounded-lg hover:bg-[#D0FE17] hover:text-black transition"
            title="Edit with Prompt"
          >
            <MessageSquarePlus size={20} />
          </button>
        </div>

        <div className="absolute top-5 right-5 z-20">
          <button
            onClick={handleExit}
            className="flex items-center justify-center p-2 bg-[#1A1A1A] border border-[#333] text-white rounded-full hover:bg-red-500/80 hover:border-red-400 transition"
            title="Back to Main Canvas"
          >
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="relative flex-1 min-h-0">
          {userImage && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <img
                ref={imageRef}
                src={userImage}
                alt="Drawing Reference"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          {imageRect && userImage && (
            <BrushCanvas
              ref={brushCanvasRef}
              imageRect={imageRect}
              baseImageSrc={userImage}
              initialProject={initialProject}
              onDirty={() => setIsDirty(true)}
            />
          )}
        </div>

        <div className="w-full px-5 pb-5 shrink-0 z-10">
          <div className="flex items-end gap-2">
            <div className="flex-grow">
              <BrushControls />
            </div>
          </div>
        </div>
        
        <PromptBox 
          open={promptOpen} 
          onClose={closePromptBox} 
          overrideDisplayImage={liveCanvasImage}
        />
      </div>

      <ConfirmExitModal
        isOpen={showConfirmExitModal}
        onClose={() => setShowConfirmExitModal(false)}
        onConfirm={confirmAndExit}
      />
    </>
  );
}