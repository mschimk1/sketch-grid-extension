/* global chrome */
import { EXTENSION_ID } from '../constants';

export const getOrCreateExtensionElement = document => {
  let extensionRoot = document.getElementById(EXTENSION_ID);
  if (!extensionRoot) {
    // Creating React app mount div dynamically so that this code can be reused as content_script
    extensionRoot = document.createElement('div');
    extensionRoot.id = EXTENSION_ID;
    document.body.insertBefore(extensionRoot, document.body.childNodes[0]);
  }
  return extensionRoot;
};

export const removeExtensionElement = document => {
  let extensionRoot = document.getElementById(EXTENSION_ID);
  extensionRoot && extensionRoot.parentNode.removeChild(extensionRoot);
};

export const getView = location => location.hash.substring(1);

export const isPopupView = ({ view }) => view === 'popup';
export const isOptionsView = ({ view }) => view === 'options';
export const isContentView = ({ view }) => !isPopupView({ view }) && !isOptionsView({ view });

export function isBackgroundPage(window) {
  return window.location.protocol === 'chrome-extension:' && chrome.extension.getBackgroundPage() === window;
}

const main = {
  getOrCreateExtensionElement,
  removeExtensionElement,
  getView,
  isPopupView,
  isOptionsView,
  isBackgroundPage
};

export default main;
