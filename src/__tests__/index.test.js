/* global chrome */
import configureStore from 'redux-mock-store';
import { LOCAL_STORAGE_KEY } from '../constants';
import getState from '../utils/getState';
import App from '../App';
import bootstrap from '../index';
import { SET_OPTIONS, UPDATE_STATE } from '../store/actions';

const mockStore = configureStore([]);

jest.mock('../App', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue(null)
}));

jest.mock('../utils/getState', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../store/configureStore', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(state => mockStore(state))
}));

beforeEach(() => {
  localStorage.setItem(LOCAL_STORAGE_KEY, false);
  getState.mockResolvedValue({ [LOCAL_STORAGE_KEY]: false });
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.restoreAllMocks();
});

test('Renders the popup view', async () => {
  await bootstrap('popup');
  expect(App).toHaveBeenCalledWith({ view: 'popup' }, {});
});

test('Renders the options view', async () => {
  await bootstrap('options');
  expect(App).toHaveBeenCalledWith({ view: 'options' }, {});
});

test('Renders the content script view if the grid is visible initially', async () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  await bootstrap();
  expect(App).toHaveBeenCalled();
});

test('Renders the content script view if the grid becomes visible', async () => {
  getState.mockResolvedValueOnce({ [LOCAL_STORAGE_KEY]: true });
  const store = await bootstrap();
  store.dispatch({
    type: UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: true }
  });
  expect(App).toHaveBeenCalled();
});

test('Does not render the content script view if the grid is not visible', async () => {
  await bootstrap();
  expect(App).not.toHaveBeenCalled();
});

test('Content script view dispatches store changes to background page', async () => {
  const backgroundUpdateMessage = { action: 'updateState', state: { [LOCAL_STORAGE_KEY]: false } };
  const store = await bootstrap();
  store.dispatch({
    type: SET_OPTIONS,
    payload: { options: 'value' }
  });
  expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(backgroundUpdateMessage);
});

test('Content initialises grid visibility in local storage', () => {
  const initialValue = !!JSON.parse(localStorage.getItem('TEST'));
  expect(initialValue).toBe(false);
});

test('Content script synchronises state with local storage', async () => {
  const store = await bootstrap();
  const actions = store.getActions();
  const expectedPayload = { payload: { [LOCAL_STORAGE_KEY]: false }, type: 'UPDATE_STATE' };
  expect(actions).toEqual([expectedPayload]);
  expect(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))).toBe(false);
});

test('Content script view dispatches store UPDATE_STATE action', async () => {
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'updateState', state: { test: 'data' } });
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, true);
  const store = await bootstrap();
  const actions = store.getActions();
  const syncPayload = { payload: { 'Grid.Visible': true }, type: 'UPDATE_STATE' };
  const expectedPayload = { type: 'UPDATE_STATE', payload: { test: 'data' } };
  expect(actions).toEqual([syncPayload, expectedPayload]);
});

test('Content script view registers listener for updates from background page', async () => {
  await bootstrap();
  expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
});

test('Popup view subscribes to store state changes', async () => {
  const backgroundUpdateMessage = { action: 'updateState', state: { [LOCAL_STORAGE_KEY]: false } };
  const store = await bootstrap('popup');
  store.dispatch({
    type: 'SET_OPTIONS',
    state: { options: 'value' }
  });
  expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(backgroundUpdateMessage);
});

test('Popup view sends updates to content script of current tab', async () => {
  expect.assertions(1);
  const contentUpdateMessage = { action: 'updateState', state: { [LOCAL_STORAGE_KEY]: false } };
  const store = await bootstrap('popup');
  store.dispatch({
    type: 'SET_OPTIONS',
    state: { options: 'value' }
  });
  expect(chrome.tabs.sendMessage).toHaveBeenCalledWith(1, contentUpdateMessage);
});
