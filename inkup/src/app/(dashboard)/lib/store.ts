import { create } from 'zustand';

export type Tool = 'pen' | 'eraser';
export type ModelType = 'Basic' | 'Realistic' | 'Anime';

interface Bookmark {
  image: string;
  tag?: string;
  timestamp?: string;
  model?: ModelType;
}

interface ToolState {
  selectedImage: string | null;
  customItemImage: string | null; // ✅ NEW
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

  // Setters
  setSelectedImage: (img: string | null) => void;
  setCustomItemImage: (img: string | null) => void; // ✅ NEW
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
}

export const useToolStore = create<ToolState>((set) => ({
  selectedImage: null,
  customItemImage: null, // ✅
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

  setSelectedImage: (img) => set({ selectedImage: img }),
  setCustomItemImage: (img) => set({ customItemImage: img }), // ✅
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

  reset: () =>
    set({
      selectedImage: null,
      customItemImage: null, // ✅
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
}));
