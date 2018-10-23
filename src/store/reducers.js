/* global chrome */
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { INIT, INIT_TAB, SET_REDUCER_STATE, UPDATE_STATE, SET_OPTIONS } from './actions';
import { EXTENSION_ID } from '../constants';

export const extensionReducer = (state = {}, action = {}) => {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_STATE: {
      return { ...state, ...payload };
    }
    case SET_OPTIONS: {
      return { ...state, ...{ options: { ...state.options, ...payload } } };
    }
    default:
      return state;
  }
};

const saveQueue = [];
let saving = false;

export const saveState = tabId => {
  const saveToStorage = state => {
    if (saving) {
      saveQueue.push(state);
      return Promise.resolve();
    }
    saving = true;
    return new Promise((resolve, reject) => {
      const data = { [tabId ? tabId : EXTENSION_ID]: state };
      chrome.storage.local.set(data, () => {
        saving = false;
        if (chrome.runtime.lastError) {
          return reject();
        }
        if (saveQueue.length > 0) {
          const nextState = saveQueue.shift();
          return saveToStorage(nextState);
        }
        resolve();
      });
    });
  };
  return saveToStorage;
};

export const chromeStorageReducer = reducer => {
  let initialState;
  let store;
  let callback = () => {};
  let saveReducerState;
  let initialized = false;

  function initReducer(state, tabId) {
    saveReducerState = saveState(tabId);

    function addStorageChangedListener(tabId) {
      chrome.storage.onChanged.addListener(changes => {
        changes = changes[tabId] || changes[EXTENSION_ID];
        setReducerState(changes.newValue);
      });
    }

    chrome.storage.local.get(tabId ? [tabId, EXTENSION_ID] : EXTENSION_ID, data => {
      data = data[tabId] || data[EXTENSION_ID];
      if (isEmpty(data)) {
        return saveReducerState({ ...state }).then(() => {
          addStorageChangedListener(tabId);
          initialized = true;
          callback.call(null, store);
        });
      }
      setReducerState(data);
      addStorageChangedListener(tabId);
      initialized = true;
      callback.call(null, store);
    });
  }

  function setReducerState(state) {
    store.dispatch({
      type: SET_REDUCER_STATE,
      state: { ...state }
    });
  }

  return (state, action) => {
    let currentState;
    switch (action.type) {
      case INIT: {
        store = action.store;
        callback = action.callback;
        initialized = false;
        initReducer(initialState);
        currentState = initialState;
        return currentState;
      }
      case INIT_TAB: {
        initialized = false;
        initReducer(currentState, action.payload);
        return currentState;
      }
      case SET_REDUCER_STATE: {
        currentState = reducer(action.state, action);
        return currentState;
      }
      default: {
        const nextState = reducer(state, action);
        if (!initialState) {
          initialState = nextState;
        }
        if (initialized && !isEqual(nextState, currentState)) {
          currentState = nextState;
          saveReducerState({ ...currentState });
        } else {
          currentState = nextState;
        }
        return currentState;
      }
    }
  };
};

export default chromeStorageReducer(extensionReducer);
