/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { LOCAL_STORAGE_KEY } from './constants';
import {
  getOrCreateExtensionElement,
  removeExtensionElement,
  getView,
  isContentView,
  isPopupView,
  isOptionsView
} from './utils/browser';
import getState from './utils/getState';
import configureStore from './store/configureStore';
import { isGridVisible } from './store/selectors';
import { UPDATE_STATE } from './store/actions';
import App from './App';

const createUpdateStateAction = state => ({
  action: 'updateState',
  state
});

const renderView = store => view => {
  const mounTo = getOrCreateExtensionElement(document);
  ReactDOM.render(
    <Provider store={store}>
      <App view={view} />
    </Provider>,
    mounTo
  );
};

export const bootstrap = async (view = '') => {
  const initialState = await getState();
  const store = configureStore(initialState);
  const renderViewWithStore = renderView(store);

  if (isContentView({ view })) {
    store.subscribe(() => {
      // Dispatch updates to background page
      chrome.runtime.sendMessage(createUpdateStateAction(store.getState()));
      // Set Grid component visibility
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(isGridVisible(store.getState())));

      isGridVisible(store.getState()) ? renderViewWithStore(view) : removeExtensionElement(document);
    });

    const gridVisible = !!JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));

    // sync grid visibility state with local storage
    store.dispatch({
      type: UPDATE_STATE,
      payload: { [LOCAL_STORAGE_KEY]: gridVisible }
    });

    // Receive updates from popup window
    if (chrome.runtime && chrome.runtime.id) {
      chrome.runtime.onMessage.addListener(req => {
        if (req.action === 'updateState') {
          store.dispatch({
            type: UPDATE_STATE,
            payload: req.state
          });
        }
      });
    }
    isGridVisible({ [LOCAL_STORAGE_KEY]: gridVisible }) && renderViewWithStore(view);
  } else if (isPopupView({ view }) || isOptionsView({ view })) {
    store.subscribe(() => {
      // Dispatch updates to background page
      chrome.runtime.sendMessage(createUpdateStateAction(store.getState()));
      // Dispatch updates to content script
      chrome.tabs.query({}, tabs => {
        for (let i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, createUpdateStateAction(store.getState()));
        }
      });
    });
    renderViewWithStore(view);
  }
  return store;
};

bootstrap(getView(window.location));

export default bootstrap;
