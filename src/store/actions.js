import { LOCAL_STORAGE_KEY } from '../constants';

const PREFIX = '@@sketch-grid-extension';
export const INIT = `${PREFIX}/INIT`;
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
