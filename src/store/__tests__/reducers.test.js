/* global chrome */
import { createStore } from 'redux';
import { enhancedStore } from '../configureStore';
import configureStore from 'redux-mock-store';
import { INIT, INIT_TAB, SET_OPTIONS, UPDATE_STATE, initTab } from '../actions';
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

test('chrome storage reducer initializes with redux store and callback function', () => {
  const callback = jest.fn();
  const chromeStorageStore = enhancedStore(callback)(() => mockCreateStore({}));
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
  const expectedAction = { type: INIT, store, callback };
  expect(store.getActions()).toEqual([expectedAction]);
});

test('chrome storage reducer invokes the callback when the store is initialised', done => {
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }));
  });
  const callback = jest.fn();
  const chromeStorageStore = enhancedStore(callback)(createStore);
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
  setImmediate(() => {
    expect(callback).toHaveBeenCalledWith(store);
    done();
  });
});

test('chrome storage reducer lets extension reducer handle application action', done => {
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }));
  });
  const callback = jest.fn();
  const chromeStorageStore = enhancedStore(callback)(createStore);
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
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
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }));
  });
  chrome.storage.onChanged.addListener.mockImplementationOnce(cb => {
    cb({ [EXTENSION_ID]: { newValue: { options: { blockSize: 255 } } } });
  });
  const callback = jest.fn();
  const chromeStorageStore = enhancedStore(callback)(createStore);
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);
  setImmediate(() => {
    expect(store.getState()).toEqual({ options: { blockSize: 255 } });
    done();
  });
});

test('chrome storage reducer handles init tab action', done => {
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ [EXTENSION_ID]: { options: { blockSize: 8 } } }), 0);
  });
  //tab storage
  chrome.storage.local.get.mockImplementationOnce((key, cb) => {
    setImmediate(() => cb({ '1234': { options: { blockSize: 101 } } }));
  });
  const callback = jest.fn();
  const chromeStorageStore = enhancedStore(callback)(createStore);
  const finalReducer = chromeStorageReducer(extensionReducer);
  const store = chromeStorageStore(finalReducer);

  new Promise(resolve => {
    setImmediate(() => {
      store.dispatch(initTab('1234'));
      setTimeout(() => resolve(), 0);
    });
  }).then(() => {
    expect(store.getState()).toEqual({ options: { blockSize: 101 } });
    done();
  });
});
