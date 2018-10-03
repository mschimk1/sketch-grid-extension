import { LOCAL_STORAGE_KEY } from '../../constants';
import { isGridVisible, getGridOptions } from '../selectors';

test('isGridVisible returns grid visibility ', () => {
  const state = {
    [LOCAL_STORAGE_KEY]: false
  };
  expect(isGridVisible(state)).toBe(false);

  state[LOCAL_STORAGE_KEY] = true;

  expect(isGridVisible(state)).toBe(true);
});

test('getGridOptions returns the options', () => {
  const state = {
    options: {
      blockSize: 8,
      thickLinesEvery: 4
    },
    [LOCAL_STORAGE_KEY]: false
  };
  expect(getGridOptions(state)).toEqual({
    blockSize: 8,
    thickLinesEvery: 4
  });
});
