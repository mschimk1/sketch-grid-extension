import configureStore, { enhancedStore } from '../configureStore';

test('enhanced store dispatches init action with store', () => {
  const callback = jest.fn();
  const dispatch = jest.fn();
  const store = { dispatch };
  const createStore = jest.fn().mockReturnValue(store);
  enhancedStore(callback)(createStore)();
  expect(dispatch).toHaveBeenCalledWith({ type: '@@sketch-grid-extension/INIT', store, callback });
});

test('enhanced store sets default init callback function', () => {
  const dispatch = jest.fn();
  const store = { dispatch };
  const createStore = jest.fn().mockReturnValue(store);
  enhancedStore()(createStore)();
  expect(dispatch.mock.calls[0][0].callback).toBeDefined();
});

test('configureStore adds enhanced store', () => {
  const initialState = { test: 'data' };
  const callback = jest.fn();
  const store = configureStore(initialState, callback);
  expect(store.getState()).toEqual(initialState);
});
