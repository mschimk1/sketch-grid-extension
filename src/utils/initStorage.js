import { LOCAL_STORAGE_KEY } from '../constants';

export default {
  options: {
    blockSize: 8,
    thickLinesEvery: 6,
    lightColor: 'rgba(255, 0, 0, 0.2)',
    darkColor: 'rgba(0, 0, 255, 0.2)',
    maxWidth: '1280px'
  },
  [LOCAL_STORAGE_KEY]: false
};
