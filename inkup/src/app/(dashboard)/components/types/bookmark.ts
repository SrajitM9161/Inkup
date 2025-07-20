import type { ModelType } from './tool';

export interface Bookmark {
  image: string;
  tag?: string;
  timestamp?: string;
  model?: ModelType;
}
