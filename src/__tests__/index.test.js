/* global chrome */
import { createStore } from 'redux';
import reducer from '../store/reducers';
import reduxStore from '../store/configureStore';
import { LOCAL_STORAGE_KEY } from '../constants';
import App from '../App';
import bootstrap from '../index';
import { UPDATE_STATE } from '../store/actions';

jest.mock('../store/configureStore', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../App', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(null)
}));

let store;

beforeEach(() => {
  localStorage.setItem(LOCAL_STORAGE_KEY, false);
  store = createStore(reducer, { [LOCAL_STORAGE_KEY]: false });
  reduxStore.mockImplementationOnce((initialState, { onInit }) => {
    onInit(store);
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Renders the popup view', () => {
  bootstrap('popup');
  expect(App).toHaveBeenCalledWith({ view: 'popup' }, {});
});

test('Renders the options view', () => {
  bootstrap('options');
  expect(App).toHaveBeenCalledWith({ view: 'options' }, {});
});

test('Does not render the content script view if the grid is not visible', () => {
  bootstrap();
  expect(App).not.toHaveBeenCalled();
});

test('Renders the content script view if the grid is visible initially', async () => {
  store = createStore(reducer, { [LOCAL_STORAGE_KEY]: true });
  reduxStore.mockImplementationOnce((initialState, { onInit }) => {
    onInit(store);
  });
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'initTab', tabId: 1234 });
  });
  await bootstrap();
  expect(App).toHaveBeenCalled();
});

test('Renders the content script view if the grid becomes visible', async () => {
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'initTab', tabId: 1234 });
  });
  await bootstrap();
  expect(App).not.toHaveBeenCalled();
  store.dispatch({
    type: UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: true }
  });
  expect(App).toHaveBeenCalledTimes(1);
});

test('Removes the content script view if the grid becomes invisible', async () => {
  store = createStore(reducer, { [LOCAL_STORAGE_KEY]: true });
  reduxStore.mockImplementationOnce((initialState, { onInit }) => {
    onInit(store);
  });
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'initTab', tabId: 1234 });
  });
  await bootstrap();
  store.dispatch({
    type: UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: false }
  });
  expect(App).toHaveBeenCalledTimes(1);
});
