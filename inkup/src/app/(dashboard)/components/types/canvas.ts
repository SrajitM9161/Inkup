import { IBrush } from './brush'; 

// --- Core Data Structures ---

export type Point = [x: number, y: number, pressure: number];

export interface Stroke {
  brush: IBrush;
  points: Point[];
}

export interface ProjectFile {
  id?: string;
  userId?: string;
  baseImageSrc: string;      
  previewImageUrl?: string; 
  createdAt?: string;
  updatedAt?: string;
  projectData: {            
    strokes: Stroke[];
    version: number;
    dimensions: {
      width: number;
      height: number;
    };
    baseImageSrc: string; 
  };
}


// --- Component Prop & Ref Types ---

export type ExportMethod = 'html' | 'pixi' | 'simple' | 'debug_layer';

export interface BrushCanvasProps {
  imageRect: DOMRect;
  baseImageSrc: string;
  initialProject?: ProjectFile | null;
}

export interface BrushCanvasHandle {
  exportImage: (method: ExportMethod) => Promise<void>;
  exportToBase64: () => Promise<string | null>;
  getProjectData: () => Partial<ProjectFile> | null; 
}