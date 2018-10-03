/* global chrome */
import initStorage from './initStorage';
import createInitialState from './createInitialState';

export default function getState() {
  return new Promise((resolve, reject) => {
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.sendMessage(
        {
          action: 'getState'
        },
        response => {
          if (response) {
            return resolve(response);
          } else {
            return reject(new Error('Cannot get state from background page'));
          }
        }
      );
    } else {
      return resolve(createInitialState(initStorage));
    }
  });
}
