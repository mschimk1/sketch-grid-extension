/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { LOCAL_STORAGE_KEY } from './constants';
import {
  getOrCreateExtensionElement,
  removeExtensionElement,
  getView,
  isOptionsView,
  isPopupView
} from './utils/browser';
import configureStore from './store/configureStore';
import { isGridVisible } from './store/selectors';
import initStorage from './utils/initStorage';
import App from './App';

const renderView = view => store => {
  const mounTo = getOrCreateExtensionElement(document);
  ReactDOM.render(
    <Provider store={store}>
      <App view={view} />
    </Provider>,
    mounTo
  );
};

export const bootstrap = (view = '') => {
  if (isPopupView({ view }) || isOptionsView({ view })) {
    chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      const tabId = tabs[0].id;
      configureStore(initStorage, {
        tabId: tabId.toString(),
        onInit: store => {
          chrome.tabs.sendMessage(tabId, { action: 'initTab', tabId });
          renderView(view)(store);
        }
      });
    });
  } else {
    new Promise((resolve, reject) => {
      chrome.runtime.onMessage.addListener(msg => {
        if (msg.action === 'initTab') {
          resolve(msg.tabId.toString());
        }
      });
    }).then(tabId => {
      configureStore(initStorage, {
        tabId,
        onInit: store => {
          isGridVisible(store.getState()) && renderView(view)(store);
          store.subscribe(() => {
            const gridVisible = isGridVisible(store.getState());
            // Set Grid component visibility
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(gridVisible));
            gridVisible ? renderView(view)(store) : removeExtensionElement(document);
          });
        }
      });
    });
  }
};

bootstrap(getView(window.location));

export default bootstrap;
