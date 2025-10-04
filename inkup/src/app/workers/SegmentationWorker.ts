/// <reference lib="webworker" />

console.log('[Worker] Segmentation Worker initialized');

import { SamModel, AutoProcessor, RawImage } from '@huggingface/transformers';

type ProgressCallback = (progress: {
  status: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}) => void;

class SegmentationPipeline {
  static model: any = null;
  static processor: any = null;
  static instance: SegmentationPipeline | null = null;
  static isLoading: boolean = false;
  static lastProgressPercent: number = -1; 

  static async getInstance(progress_callback?: ProgressCallback) {
    
    if (this.isLoading) {
      return null;
    }
    
    if (this.instance === null) {
      this.isLoading = true;
      this.lastProgressPercent = -1; 
      this.instance = new SegmentationPipeline();
      
      self.postMessage({
        status: 'loading',
        message: 'Loading segmentation model (this may take 30-60 seconds)...',
      });

      try {
        
        this.model = await SamModel.from_pretrained('Xenova/slimsam-77-uniform', {
          device: 'webgpu',
          dtype: 'fp16',
          progress_callback: (progress: any) => {
            const currentPercent = Math.floor(progress.progress || 0);
            if (progress.status === 'progress' && 
                currentPercent > 0 && 
                currentPercent !== this.lastProgressPercent &&
                currentPercent % 5 === 0) {
              this.lastProgressPercent = currentPercent;
              self.postMessage({
                status: 'progress',
                progress: { ...progress, progress: currentPercent },
              });
            } 
          },
        });

        this.processor = await AutoProcessor.from_pretrained('Xenova/slimsam-77-uniform');

        this.isLoading = false;
        this.lastProgressPercent = -1; 
        
        self.postMessage({
          status: 'ready',
          message: 'Model loaded successfully',
        });
        
        
      } catch (error: any) {
        this.isLoading = false;
        self.postMessage({
          status: 'error',
          message: `Failed to load model: ${error.message}`,
        });
        throw error;
      }
    } else {
    }
    return this.instance;
  }

  async segment(imageData: string, points: number[][], labels: number[]) {

    try {
      const raw_image = await RawImage.read(imageData);

      const inputs = await SegmentationPipeline.processor(raw_image, {
        input_points: [points],
        input_labels: [labels],
      });

      const startTime = Date.now();
      const outputs = await SegmentationPipeline.model(inputs);
      const inferenceTime = Date.now() - startTime;
      const masks = await SegmentationPipeline.processor.post_process_masks(
        outputs.pred_masks,
        inputs.original_sizes,
        inputs.reshaped_input_sizes
      );

      const scores = outputs.iou_scores.data;

      const serializedMasks = masks.map((mask: any) => ({
        data: Array.from(mask.data),
        dims: mask.dims ? Array.from(mask.dims) : [mask.data.length],
      }));

      const result = {
        masks: serializedMasks,
        scores: Array.from(scores),
        imageSize: {
          width: raw_image.width,
          height: raw_image.height,
        },
      };
      
      return result;
      
    } catch (error: any) {
      throw error;
    }
  }
}


self.addEventListener('message', async (event) => {
  const { type, data } = event.data;

  try {
    const pipeline = await SegmentationPipeline.getInstance();

    if (type === 'segment') {
      if (!pipeline) {
        self.postMessage({
          status: 'error',
          message: 'Model still loading, please wait...',
        });
        return;
      }
      
      const result = await pipeline.segment(data.image, data.points, data.labels);
      
      self.postMessage({
        status: 'complete',
        result,
      });
    } else if (type === 'init') {
      await SegmentationPipeline.getInstance();
    }
  } catch (error: any) {
    self.postMessage({
      status: 'error',
      message: error.message || 'Unknown error occurred',
    });
  }
});

setTimeout(() => {
  self.postMessage({
    status: 'initialized',
    message: 'Worker initialized and ready',
  });
}, 100);
