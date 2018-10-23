import { LOCAL_STORAGE_KEY } from '../constants';

const PREFIX = '@@sketch-grid-extension';
export const INIT = `${PREFIX}/INIT`;
export const INIT_TAB = `${PREFIX}/INIT_TAB`;
export const SET_REDUCER_STATE = `${PREFIX}/SET_REDUCER_STATE`;
export const UPDATE_STATE = `${PREFIX}/UPDATE_STATE`;
export const SET_OPTIONS = `${PREFIX}/SET_OPTIONS`;

export const updateState = state => ({
  type: UPDATE_STATE,
  payload: state
});

export const setOptions = options => ({
  type: SET_OPTIONS,
  payload: options
});

export const toggleGrid = gridVisible => ({
  type: UPDATE_STATE,
  payload: { [LOCAL_STORAGE_KEY]: !gridVisible }
});

/* Dispatched by content script once the tabId is received from popup */
export const initTab = tabId => {
  return { type: INIT_TAB, payload: tabId };
};
