import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Tool, ModelType } from "../components/types/tool";
import type { Bookmark } from "../components/types/bookmark";

/* -------------------- Types -------------------- */
export interface OutputImage {
  generationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

interface OutputStoreState {
  outputImages: OutputImage[];
  setOutputImages: (images: OutputImage[]) => void;
  addOutputImage: (image: OutputImage) => void;
  clearOutputImages: () => void;
  appendOutputImages: (images: OutputImage[]) => void;
}

interface ToolState {
  /* Core session */
  userImage: string | null;
  uploadedFile: File | null;
  isUploadModalOpen: boolean;

  /* Item tools */
  itemImage: string | null;
  customItemImage: string | null;
  itemTool: Tool;
  itemStrokeWidth: number;

  /* Editing state */
  mask: string | null;
  resultImage: string | null;
  isGenerating: boolean;
  tool: Tool;
  strokeWidth: number;

  /* Meta */
  bookmarks: Bookmark[];
  model: ModelType;
  aspectRatio: string;
  maskOpacity: number;
  penColor: string;
  generatedItems: string[];

  /* Actions */
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

  undo: () => void;
  redo: () => void;

  reset: () => void;
  clearPersistedImages: () => void;
}

interface EditToolState {
  prompt: string;
  resultImages: string[];

  setPrompt: (prompt: string) => void;
  setResultImages: (imgs: string[]) => void;
  addResultImage: (img: string) => void;
  clearImages: () => void;
  reset: () => void;
}

/* -------------------- Tool Store -------------------- */
export const useToolStore = create<ToolState>((set) => ({
  /* Core session */
  userImage: null,
  uploadedFile: null,
  isUploadModalOpen: false,

  /* Item tools */
  itemImage: null,
  customItemImage: null,
  itemTool: "pen",
  itemStrokeWidth: 5,

  /* Editing state */
  mask: null,
  resultImage: null,
  isGenerating: false,
  tool: "pen",
  strokeWidth: 10,

  /* Meta */
  bookmarks: [],
  model: "Basic" as ModelType,
  aspectRatio: "1:1",
  maskOpacity: 1,
  penColor: "#ff0000",
  generatedItems: [],

  /* Actions */
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
        { image, tag, timestamp: new Date().toISOString(), model: state.model },
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

  undo: () => {},
  redo: () => {},

  reset: () =>
    set({
      userImage: null,
      uploadedFile: null,
      isUploadModalOpen: false,
      itemImage: null,
      customItemImage: null,
      itemTool: "pen",
      itemStrokeWidth: 5,
      mask: null,
      resultImage: null,
      isGenerating: false,
      tool: "pen",
      strokeWidth: 10,
      bookmarks: [],
      model: "Basic" as ModelType,
      aspectRatio: "1:1",
      maskOpacity: 1,
      penColor: "#ff0000",
      generatedItems: [],
    }),

  clearPersistedImages: () => {
    set({ userImage: null, itemImage: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("tool-store");
    }
  },
}));

/* -------------------- Edit Tool Store (Persisted) -------------------- */
export const useEditToolStore = create<EditToolState>()(
  persist(
    (set) => ({
      prompt: "",
      resultImages: [],

      setPrompt: (prompt) => set({ prompt }),
      setResultImages: (imgs) => set({ resultImages: imgs }),
      addResultImage: (img) =>
        set((state) => ({
          resultImages: [...state.resultImages, img].slice(-20), // keep last 20
        })),
      clearImages: () => set({ resultImages: [] }),
      reset: () => set({ prompt: "", resultImages: [] }),
    }),
    { name: "edit-tool-store" }
  )
);

/* -------------------- Output Store (Persisted) -------------------- */
export const useOutputStore = create<OutputStoreState>()(
  persist(
    (set, get) => ({
      outputImages: [],

      setOutputImages: (images) => set({ outputImages: images }),
      addOutputImage: (image) =>
        set((state) => ({
          outputImages: [...state.outputImages, image].slice(-20), // keep last 20
        })),
      clearOutputImages: () => set({ outputImages: [] }),

      appendOutputImages: (images) => {
        const existing = get().outputImages;
        const combined = [...existing, ...images];

        const unique = Array.from(
          new Map(combined.map((img) => [img.assetId, img])).values()
        );

        set({ outputImages: unique });
      },
    }),
    { name: "output-store" }
  )
);
