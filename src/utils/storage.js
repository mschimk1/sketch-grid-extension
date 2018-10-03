/* global chrome */
export default {
  get: key =>
    new Promise((resolve, reject) => {
      chrome.storage.local.get(key, response => {
        const data = response[key];
        return resolve(data);
      });
    }),
  set: (key, data) =>
    new Promise(resolve => {
      chrome.storage.local.set({ [key]: data }, resolve);
    }),
  clear: () => {
    chrome.storage.local.clear();
  }
};
