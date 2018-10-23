/*global chrome*/
import { EXTENSION_ID } from './constants';

export default class GridController {
  init() {
    // reset options after installation
    chrome.runtime.onInstalled.addListener(() => {
      this.resetStorage();
    });
    //Clear tab storage when it is closed
    chrome.tabs.onRemoved.addListener(tabId => {
      chrome.storage.local.remove(tabId.toString());
    });
  }
  resetStorage() {
    chrome.storage.local.get(data => {
      const defaultSettings = data[EXTENSION_ID];
      chrome.storage.local.clear(() => {
        if (defaultSettings) {
          chrome.storage.local.set({ EXTENSION_ID: defaultSettings });
        }
      });
    });
  }
}

const gridController = new GridController();
gridController.init();
