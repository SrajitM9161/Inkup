import { create } from 'zustand';
import type { Tool, ModelType } from '../components/types/tool';
import type { Bookmark } from '../components/types/bookmark';

// ========== TYPES ==========
export interface OutputImage {
  generationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

interface ToolState {
  userImage: string | null;
  uploadedFile: File | null;
  isUploadModalOpen: boolean;

  itemImage: string | null;
  customItemImage: string | null;
  itemTool: Tool;
  itemStrokeWidth: number;

  mask: string | null;
  resultImage: string | null;
  isGenerating: boolean;
  tool: Tool;
  strokeWidth: number;
  bookmarks: Bookmark[];
  model: ModelType;
  aspectRatio: string;
  maskOpacity: number;
  penColor: string;
  generatedItems: string[];

  setUserImage: (img: string | null) => void;
  setUploadedFile: (file: File | null) => void;
  setUploadModalOpen: (val: boolean) => void;

  setItemImage: (img: string | null) => void;
  setCustomItemImage: (img: string | null) => void;
  setItemTool: (tool: Tool) => void;
  setItemStrokeWidth: (width: number) => void;

  setMask: (mask: string | null) => void;
  setResultImage: (res: string | null) => void;
  setIsGenerating: (val: boolean) => void;
  setTool: (tool: Tool) => void;
  setStrokeWidth: (width: number) => void;
  setModel: (model: ModelType) => void;
  setAspectRatio: (ratio: string) => void;
  setMaskOpacity: (opacity: number) => void;
  setPenColor: (color: string) => void;

  addBookmark: (img: string, tag?: string) => void;
  removeBookmark: (index: number) => void;

  addGeneratedItem: (img: string) => void;
  clearGeneratedItems: () => void;

  reset: () => void;
  clearPersistedImages: () => void;

  undo: () => void;
  redo: () => void;
}

interface OutputStoreState {
  outputImages: OutputImage[];
  setOutputImages: (images: OutputImage[]) => void;
  addOutputImage: (image: OutputImage) => void;
  clearOutputImages: () => void;
  appendOutputImages: (images: OutputImage[]) => void;
}

// ========== TOOL STORE ==========
export const useToolStore = create<ToolState>((set) => ({
  userImage: null,
  uploadedFile: null,
  isUploadModalOpen: false,

  itemImage: null,
  customItemImage: null,
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

  setUserImage: (img) => set({ userImage: img }),
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setUploadModalOpen: (val) => set({ isUploadModalOpen: val }),

  setItemImage: (img) => set({ itemImage: img }),
  setCustomItemImage: (img) => set({ customItemImage: img }),
  setItemTool: (tool) => set({ itemTool: tool }),
  setItemStrokeWidth: (width) => set({ itemStrokeWidth: width }),

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
    set((state) => ({
      generatedItems: [...state.generatedItems, img].slice(-10),
    })),

  clearGeneratedItems: () => set({ generatedItems: [] }),

  undo: () => {
    console.log('[store] Trigger canvas.undo() from component');
  },

  redo: () => {
    console.log('[store] Trigger canvas.redo() from component');
  },

  reset: () =>
    set({
      userImage: null,
      uploadedFile: null,
      isUploadModalOpen: false,
      itemImage: null,
      customItemImage: null,
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

  clearPersistedImages: () => {
    set({ userImage: null, itemImage: null });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tool-store');
    }
  },
}));

// ========== OUTPUT STORE ==========
export const useOutputStore = create<OutputStoreState>((set, get) => ({
  outputImages: [],

  setOutputImages: (images) => set({ outputImages: images }),

  addOutputImage: (image) =>
    set((state) => ({
      outputImages: [...state.outputImages, image].slice(-10),
    })),

  clearOutputImages: () => set({ outputImages: [] }),

  appendOutputImages: (images) => {
    const existing = get().outputImages;

    const combined = [...existing, ...images];

    // Deduplicate by `assetId`
    const unique = Array.from(new Map(combined.map(img => [img.assetId, img])).values());

    set({ outputImages: unique });
  },
}));
