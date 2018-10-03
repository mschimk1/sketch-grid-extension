/* global chrome */
import { SET_OPTIONS, UPDATE_STATE } from '../actions';
import reducer from '../reducers';
import { EXTENSION_ID, LOCAL_STORAGE_KEY } from '../../constants';
import { isBackgroundPage } from '../../utils/browser';

jest.mock('../../utils/browser');

const initialState = {};

test('has initial state', () => {
  expect(reducer()).toEqual(initialState);
});

test('unknown action does not affect state', () => {
  expect(reducer(initialState, { type: 'NOT_EXISTING' })).toEqual(initialState);
});

test('updates options', () => {
  const state = {
    options: {
      blockSize: 8,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  };
  expect(reducer(state, { type: SET_OPTIONS, payload: { blockSize: 12 } })).toEqual({
    options: {
      blockSize: 12,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  });
});

test('updates the entire state', () => {
  const state = {
    [LOCAL_STORAGE_KEY]: false,
    options: {
      blockSize: 8,
      thickLinesEvery: 4,
      darkColor: '',
      lightColor: ''
    }
  };
  const expectedState = {
    [LOCAL_STORAGE_KEY]: true,
    options: {
      blockSize: 12,
      thickLinesEvery: 6,
      darkColor: '',
      lightColor: ''
    }
  };
  expect(
    reducer(state, {
      type: UPDATE_STATE,
      payload: expectedState
    })
  ).toEqual(expectedState);
});

test('updates partial state', () => {
  const state = {
    [LOCAL_STORAGE_KEY]: false,
    options: {
      blockSize: 8,
      thickLinesEvery: 4
    }
  };
  const expectedState = {
    [LOCAL_STORAGE_KEY]: true,
    options: {
      blockSize: 8,
      thickLinesEvery: 4
    }
  };
  expect(
    reducer(state, {
      type: UPDATE_STATE,
      payload: { [LOCAL_STORAGE_KEY]: true }
    })
  ).toEqual(expectedState);
});

test('saves the state to local storage if the action is handled by the background page', () => {
  isBackgroundPage.mockReturnValueOnce(true);
  chrome.extension.getBackgroundPage.mockReturnValueOnce(window);

  const expectedState = { test: 'value' };
  reducer(initialState, {
    type: UPDATE_STATE,
    payload: expectedState
  });
  expect(JSON.parse(localStorage.getItem(EXTENSION_ID))).toEqual(expectedState);
});
