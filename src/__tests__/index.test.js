/* global chrome */
import configureStore from 'redux-mock-store';
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

const mockCreateStore = configureStore([]);
let store;

beforeEach(() => {
  localStorage.setItem(LOCAL_STORAGE_KEY, false);
  store = mockCreateStore({});
  reduxStore.mockImplementationOnce((initialState, cb) => {
    cb(store);
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

test('Renders the content script view if the grid is visible initially', () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  bootstrap();
  expect(App).toHaveBeenCalled();
});

test('Renders the content script view if the grid becomes visible', () => {
  store = mockCreateStore({ [LOCAL_STORAGE_KEY]: true });
  reduxStore.mockImplementationOnce((initialState, cb) => {
    cb(store);
  });
  bootstrap();
  store.dispatch({
    type: UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: true }
  });
  expect(App).toHaveBeenCalled();
});

test('Removes the content script view if the grid becomes invisible', () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
  store = mockCreateStore({ [LOCAL_STORAGE_KEY]: false });
  reduxStore.mockImplementationOnce((initialState, cb) => {
    cb(store);
  });
  bootstrap();
  store.dispatch({
    type: UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: false }
  });
  expect(App).toHaveBeenCalledTimes(1);
});
