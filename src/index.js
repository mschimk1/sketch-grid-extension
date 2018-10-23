/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { LOCAL_STORAGE_KEY } from './constants';
import {
  getOrCreateExtensionElement,
  removeExtensionElement,
  getView,
  isPopupView,
  isOptionsView
} from './utils/browser';
import configureStore from './store/configureStore';
import { isGridVisible } from './store/selectors';
import initStorage from './utils/initStorage';
import App from './App';

const renderView = store => view => {
  const mounTo = getOrCreateExtensionElement(document);
  ReactDOM.render(
    <Provider store={store}>
      <App view={view} />
    </Provider>,
    mounTo
  );
};

export const bootstrap = (view = '') => {
  configureStore(initStorage, store => {
    const renderViewWithStore = renderView(store);
    if (isPopupView({ view }) || isOptionsView({ view })) {
      renderViewWithStore(view);
    } else {
      const gridVisible = !!JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      store.subscribe(() => {
        // Set Grid component visibility
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(isGridVisible(store.getState())));
        isGridVisible(store.getState()) ? renderViewWithStore(view) : removeExtensionElement(document);
      });
      isGridVisible({ [LOCAL_STORAGE_KEY]: gridVisible }) && renderViewWithStore(view);
    }
  });
};

bootstrap(getView(window.location));

export default bootstrap;
