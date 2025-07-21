import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // ✅ import persist
import type { Tool, ModelType } from '../components/types/tool';
import type { Bookmark } from '../components/types/bookmark';

interface ToolState {
  // === USER Canvas/Image ===
  selectedImage: string | null;
  customItemImage: string | null;
  uploadedFile: File | null;
  isUploadModalOpen: boolean;

  // === ITEM Canvas/Image ===
  itemImage: string | null;
  itemTool: Tool;
  itemStrokeWidth: number;

  // === Common ===
  mask: string | null;
  resultImage: string | null;
  isGenerating?: boolean;
  tool: Tool;
  strokeWidth: number;
  bookmarks: Bookmark[];
  model: ModelType;
  aspectRatio: string;
  maskOpacity: number;
  penColor: string;
  generatedItems: string[];

  // === Methods ===
  setSelectedImage: (img: string | null) => void;
  setCustomItemImage: (img: string | null) => void;
  setUploadedFile: (file: File | null) => void;
  setUploadModalOpen: (val: boolean) => void;

  setItemImage: (img: string | null) => void;
  setItemTool: (tool: Tool) => void;
  setItemStrokeWidth: (width: number) => void;

  setMask: (mask: string) => void;
  setResultImage: (res: string) => void;
  setIsGenerating: (val: boolean) => void;
  setTool: (tool: Tool) => void;
  setStrokeWidth: (width: number) => void;
  addBookmark: (img: string, tag?: string) => void;
  removeBookmark: (index: number) => void;
  setModel: (model: ModelType) => void;
  setAspectRatio: (ratio: string) => void;
  setMaskOpacity: (opacity: number) => void;
  setPenColor: (color: string) => void;
  addGeneratedItem: (img: string) => void;
  clearGeneratedItems: () => void;
  reset: () => void;

  undo: () => void;
  redo: () => void;
}

export const useToolStore = create<ToolState>()(
  persist(
    (set) => ({
      // === USER Canvas ===
      selectedImage: null,
      customItemImage: null,
      uploadedFile: null,
      isUploadModalOpen: false,

      // === ITEM Canvas ===
      itemImage: null,
      itemTool: 'pen',
      itemStrokeWidth: 5,

      // === Common ===
      mask: null,
      resultImage: null,
      isGenerating: false,
      tool: 'pen',
      strokeWidth: 10,
      bookmarks: [],
      model: 'Basic',
      aspectRatio: '1:1',
      maskOpacity: 1,
      penColor: '#ff0000',
      generatedItems: [],

      // === USER ===
      setSelectedImage: (img) => {
        console.log('[store] setSelectedImage called with:', img);
        set({ selectedImage: img });
      },
      setCustomItemImage: (img) => set({ customItemImage: img }),
      setUploadedFile: (file) => set({ uploadedFile: file }),
      setUploadModalOpen: (val) => set({ isUploadModalOpen: val }),

      // === ITEM ===
      setItemImage: (img) => set({ itemImage: img }),
      setItemTool: (tool) => set({ itemTool: tool }),
      setItemStrokeWidth: (width) => set({ itemStrokeWidth: width }),

      // === Common ===
      setMask: (mask) => set({ mask }),
      setResultImage: (res) => set({ resultImage: res }),
      setIsGenerating: (val) => set({ isGenerating: val }),
      setTool: (tool) => set({ tool }),
      setStrokeWidth: (width) => set({ strokeWidth: width }),
      setModel: (model) => set({ model }),
      setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
      setMaskOpacity: (opacity) => set({ maskOpacity: opacity }),
      setPenColor: (color) => set({ penColor: color }),

      addBookmark: (image, tag) =>
        set((state) => ({
          bookmarks: [
            ...state.bookmarks,
            {
              image,
              tag,
              timestamp: new Date().toISOString(),
              model: state.model,
            },
          ],
        })),

      removeBookmark: (index) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((_, i) => i !== index),
        })),

      addGeneratedItem: (img) =>
        set((state) => {
          const updated = [...state.generatedItems, img];
          return { generatedItems: updated.slice(-10) };
        }),

      clearGeneratedItems: () => set({ generatedItems: [] }),

      undo: () => {
        console.log('[store] Trigger canvas.undo() from component');
      },

      redo: () => {
        console.log('[store] Trigger canvas.redo() from component');
      },

      reset: () =>
        set({
          selectedImage: null,
          customItemImage: null,
          uploadedFile: null,
          isUploadModalOpen: false,

          itemImage: null,
          itemTool: 'pen',
          itemStrokeWidth: 5,

          mask: null,
          resultImage: null,
          isGenerating: false,
          tool: 'pen',
          strokeWidth: 10,
          bookmarks: [],
          model: 'Basic',
          aspectRatio: '1:1',
          maskOpacity: 1,
          penColor: '#ff0000',
          generatedItems: [],
        }),
    }),
    {
      name: 'tool-store', 
      partialize: (state) => ({
        selectedImage: state.selectedImage,
        itemImage: state.itemImage,
      }), 
    }
  )
);
