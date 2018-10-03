import { LOCAL_STORAGE_KEY } from '../constants';
export const UPDATE_STATE = 'UPDATE_STATE';
export const SET_OPTIONS = 'SET_OPTIONS';

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
