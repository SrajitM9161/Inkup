import { IBrush } from '../components/types/brush';

export const defaultBrush: IBrush = {
  color: '#000000',
  size: 32,
  spacing: 0.15,
  speed: 0.62,
  variation: 0.82,
  streamline: 0.5,
  opacity: 1,
  alpha: 0.9,
  jitter: 0.06,
  sizeJitter: 0,
  type: 'mouse',
};

export const charcoalBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 40,
  spacing: 0.1,
  jitter: 0.5,
  sizeJitter: 0.5,
  alpha: 0.5,
};

export const inkPenBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 12,
  spacing: 0.1,
  speed: 0.8,
  variation: 0.9,
  streamline: 0.8,
  alpha: 0.95,
  jitter: 0,
  sizeJitter: 0.1,
};

export const airbrushBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 60,
  spacing: 0.05,
  speed: 0.5,
  variation: 0.2,
  streamline: 0.2,
  alpha: 0.1,
  jitter: 0.8,
  sizeJitter: 0.3,
};

export const markerBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 25,
  spacing: 0.12,
  speed: 0.7,
  variation: 0.1,
  streamline: 0.6,
  opacity: 0.8,
  alpha: 0.7,
  jitter: 0.02,
  sizeJitter: 0,
};

export const eraserBrush: IBrush = {
  ...defaultBrush, 
  type: 'eraser',
  color: '#000000',
  size: 30,
  alpha: 1,
  jitter: 0.2,
  sizeJitter: 0.1,
  spacing: 0.2,
};


export const sketchPencilBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 8,
  alpha: 0.4,
  spacing: 0.3,
  variation: 0.8,
  jitter: 0.2,
  sizeJitter: 0.1,
  streamline: 0.3,
};


export const technicalPenBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 2,
  alpha: 1,
  spacing: 0.01,
  variation: 0, 
  jitter: 0,
  sizeJitter: 0,
  streamline: 0.8,
};


export const calligraphyPenBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 20,
  alpha: 0.95,
  spacing: 0.05,
  variation: 0.9,
  jitter: 0,
  sizeJitter: 0,
  streamline: 0.9, 
};

export const gouacheBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 50,
  alpha: 0.9,
  spacing: 0.05,
  variation: 0.3,
  jitter: 0.1,
  sizeJitter: 0.2,
  streamline: 0.2,
};


export const watercolorBrush: IBrush = {
  ...defaultBrush,
  color: '#000000',
  size: 70,
  alpha: 0.08, 
  opacity: 0.5, 
  spacing: 0.1,
  variation: 0.5,
  jitter: 0.6,
  sizeJitter: 0.4,
  streamline: 0.1,
};

