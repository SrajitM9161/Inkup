import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface EditOutputImage {
  editGenerationId: string;
  assetId: string;
  outputImageUrl: string;
  createdAt: string;
}

interface EditedOutputStoreState {
  editedImages: EditOutputImage[];
  setEditedImages: (images: EditOutputImage[]) => void;
  addEditedImages: (images: EditOutputImage[]) => void;
  clearEditedImages: () => void;
}

export const useEditedOutputStore = create<EditedOutputStoreState>()(
  persist(
    (set, get) => ({
      editedImages: [],

      setEditedImages: (images) => set({ editedImages: images }),

      addEditedImages: (images) => {
        const existing = get().editedImages;
        const combined = [...existing, ...images];
        const unique = Array.from(
          new Map(combined.map((img) => [img.assetId, img])).values()
        );
        set({ editedImages: unique });
      },

      clearEditedImages: () => set({ editedImages: [] }),
    }),
    { name: "edited-output-store" }
  )
);
