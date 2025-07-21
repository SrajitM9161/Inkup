import { useToolStore } from './store';

const channel = new BroadcastChannel('generated-sync');

export const broadcastGeneratedImage = (img: string) => {
  channel.postMessage({ type: 'add_generated', img });
};

export const listenToGeneratedImages = () => {
  const addGeneratedItem = useToolStore.getState().addGeneratedItem;

  channel.onmessage = (event) => {
    const { type, img } = event.data;
    if (type === 'add_generated' && img) {
      addGeneratedItem(img);
    }
  };
};
