import { IBrush } from '../components/types/brush';

export const defaultBrush: IBrush = {
  color: '#ffbe0c',
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
  color: '#333333',
  size: 40,
  spacing: 0.1,
  jitter: 0.5,
  sizeJitter: 0.5,
  alpha: 0.5,
};

export const inkPenBrush: IBrush = {
  ...defaultBrush,
  color: '#1a1a1a',
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
  color: '#00aaff',
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
  color: '#ff0066',
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