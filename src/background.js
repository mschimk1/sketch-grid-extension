/*global chrome*/
import { EXTENSION_ID } from './constants';
import { UPDATE_STATE } from './store/actions';
import configureStore from './store/configureStore';
import initStorage from './utils/initStorage';
import createInitialState from './utils/createInitialState';
import storage from './utils/storage';

export default class GridController {
  constructor(store) {
    this._store = store;
  }
  init() {
    chrome.runtime.onMessage.addListener((req, _, sendResponse) => {
      if (req.action === 'updateState') this.initStore().then(this.updateState(req.state));
      if (req.action === 'getState') this.initStore().then(this.sendState(sendResponse));
    });
    chrome.runtime.onInstalled.addListener(() => {
      storage.clear();
      storage.set(EXTENSION_ID, initStorage);
    });
  }
  async initStore() {
    if (!this._store) {
      const storedSettings = await storage.get(EXTENSION_ID);
      const initialState = createInitialState(storedSettings || initStorage);
      this._store = configureStore(initialState);
    }
  }
  updateState(state) {
    this._store.dispatch({
      type: UPDATE_STATE,
      payload: state
    });
  }
  sendState(sendResponse) {
    sendResponse(this._store.getState());
  }
}

const gridController = new GridController();
gridController.init();
