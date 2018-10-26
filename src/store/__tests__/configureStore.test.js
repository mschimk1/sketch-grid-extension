import configureStore, { enhancedStore } from '../configureStore';

test('enhanced store dispatches init action with store', () => {
  const tabId = '1234';
  const callback = jest.fn();
  const dispatch = jest.fn();
  const store = { dispatch };
  const createStore = jest.fn().mockReturnValue(store);
  enhancedStore({ tabId, onInit: callback })(createStore)();
  expect(dispatch).toHaveBeenCalledWith({ type: '@@sketch-grid-extension/INIT', store, onInit: callback, tabId });
});

test('enhanced store sets default init callback function', () => {
  const dispatch = jest.fn();
  const store = { dispatch };
  const createStore = jest.fn().mockReturnValue(store);
  enhancedStore({ tabId: '1234' })(createStore)();
  expect(dispatch.mock.calls[0][0].onInit).toBeDefined();
});

test('configureStore adds enhanced store', () => {
  const initialState = { test: 'data' };
  const store = configureStore(initialState, { tabId: '1234' });
  expect(store.getState()).toEqual(initialState);
});
