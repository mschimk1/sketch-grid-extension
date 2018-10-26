/* global chrome */
import { createStore } from 'redux';
import { enhancedStore } from '../configureStore';
import configureStore from 'redux-mock-store';
import { INIT, SET_OPTIONS, UPDATE_STATE, initTab } from '../actions';
import { extensionReducer, saveState, chromeStorageReducer } from '../reducers';
import { EXTENSION_ID, LOCAL_STORAGE_KEY } from '../../constants';

const mockCreateStore = configureStore([]);
const initialState = {};

afterEach(() => {
  jest.clearAllMocks();
});

test('has initial state', () => {
  expect(extensionReducer()).toEqual(initialState);
});

test('unknown action does not affect state', () => {
  expect(extensionReducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState);
});

test('updates options', () => {
  const state = {
    options: {
      blockSize: 8,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  };
  expect(extensionReducer(state, { type: SET_OPTIONS, payload: { blockSize: 12 } })).toEqual({
    options: {
      blockSize: 12,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  });
});

test('updates the entire state', () => {
  const state = {
    [LOCAL_STORAGE_KEY]: false,
    options: {
      blockSize: 8,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  };
  const expectedState = {
    [LOCAL_STORAGE_KEY]: true,
    options: {
      blockSize: 12,
      thickLinesEvery: 6,
      darkColor: '',
      lightColor: ''
    }
  };
  expect(
    extensionReducer(state, {
      type: UPDATE_STATE,
      payload: expectedState
    })
  ).toEqual(expectedState);
});

test('updates partial state', () => {
  const state = {
    [LOCAL_STORAGE_KEY]: false,
    options: {
      blockSize: 8,
      thickLinesEvery: 4
    }
  };
  const expectedState = {
    [LOCAL_STORAGE_KEY]: true,
    options: {
      blockSize: 8,
      thickLinesEvery: 4
    }
  };
  expect(
    extensionReducer(state, {
      type: UPDATE_STATE,
      payload: { [LOCAL_STORAGE_KEY]: true }
    })
  ).toEqual(expectedState);
});

test('saveState returns a function', () => {
  expect(saveState).toEqual(expect.any(Function));
});

test('saveState function can save global state in storage', async () => {
  const saveSettings = saveState();
  await saveSettings({ test: 'state' });
  expect(chrome.storage.local.set).toHaveBeenCalled();
  expect(chrome.storage.local.set).toHaveBeenCalledWith({ [EXTENSION_ID]: { test: 'state' } }, expect.any(Function));
});

test('saveState function can save tab state in storage', async () => {
  const saveSettings = saveState('1234');
  await saveSettings({ test: 'state' });
  expect(chrome.storage.local.set).toHaveBeenCalled();
  expect(chrome.storage.local.set).toHaveBeenCalledWith({ '1234': { test: 'state' } }, expect.any(Function));
});

test('saveState function queues state changes if already saving', done => {
  chrome.storage.local.set.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 12 } } }));
  });
  chrome.storage.local.set.mockImplementationOnce((key, cb) => {
    cb({ [EXTENSION_ID]: { options: { blockSize: 12 } } });
  });
  const saveSettings = saveState();
  saveSettings({ test: 'state1' });
  saveSettings({ test: 'state2' });

  setImmediate(() => {
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(2);
    expect(chrome.storage.local.set).toHaveBeenNthCalledWith(
      1,
      { [EXTENSION_ID]: { test: 'state1' } },
      expect.anything()
    );
    expect(chrome.storage.local.set).toHaveBeenLastCalledWith(
      { [EXTENSION_ID]: { test: 'state2' } },
      expect.anything()
    );
    done();
  });
});

test('saveState rejects if chrome signals runtime error', async () => {
  chrome.runtime.lastError = true;
  expect.assertions(1);
  const saveSettings = saveState();
  try {
    await saveSettings({ test: 'state' });
  } catch (e) {
    expect(chrome.storage.local.set).toHaveBeenCalledTimes(1);
  }
  chrome.runtime.lastError = false;
});

test('chrome storage reducer initializes with redux store, tabId and onInit callback function', () => {
  const tabId = '1234';
  const onInit = jest.fn();
  const chromeStorageStore = enhancedStore({ tabId, onInit })(() => mockCreateStore({}));
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
  const expectedAction = { type: INIT, store, onInit, tabId };
  expect(store.getActions()).toEqual([expectedAction]);
});

test('chrome storage reducer invokes the callback when the store is initialised', done => {
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }));
  });
  const tabId = '1234';
  const onInit = jest.fn();

  const chromeStorageStore = enhancedStore({ tabId, onInit })(createStore);
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
  setImmediate(() => {
    expect(onInit).toHaveBeenCalledWith(store);
    done();
  });
});

test('chrome storage reducer lets extension reducer handle application action', done => {
  const tabId = '1234';
  const onInit = jest.fn();
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }));
  });
  const chromeStorageStore = enhancedStore({ tabId, onInit })(createStore);
  const reducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(reducer);
  setImmediate(() => {
    store.dispatch({
      type: SET_OPTIONS,
      payload: { blockSize: 12 }
    });
    expect(store.getState()).toEqual({ options: { blockSize: 12 } });
    done();
  });
});

test('chrome store reducer sets new reducer state if chrome storage changes', done => {
  const tabId = '1234';
  const onInit = jest.fn();

  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ '1234': { options: { blockSize: 8 } } }));
  });
  chrome.storage.onChanged.addListener.mockImplementationOnce(cb => {
    cb({ '1234': { newValue: { options: { blockSize: 255 } } } });
  });
  const chromeStorageStore = enhancedStore({ tabId, onInit })(createStore);
  const reducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(reducer);
  setImmediate(() => {
    expect(store.getState()).toEqual({ options: { blockSize: 255 } });
    done();
  });
});

test('chrome store reducer ignores chrome storage changes in other tabs', done => {
  const tabId = '1234';
  const onInit = jest.fn();

  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ '1234': { options: { blockSize: 8 } } }));
  });
  chrome.storage.onChanged.addListener.mockImplementationOnce(cb => {
    cb({ '5678': { newValue: { options: { blockSize: 255 } } } });
  });
  const chromeStorageStore = enhancedStore({ tabId, onInit })(createStore);
  const reducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(reducer);
  setImmediate(() => {
    expect(store.getState()).toEqual({ options: { blockSize: 8 } });
    done();
  });
});
