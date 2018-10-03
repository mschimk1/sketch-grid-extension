import { isBackgroundPage } from '../utils/browser';
import { UPDATE_STATE, SET_OPTIONS } from './actions';
import { EXTENSION_ID } from '../constants';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case UPDATE_STATE: {
      const newState = { ...state, ...payload };
      // update storage only in the backround page
      if (isBackgroundPage(window)) {
        localStorage.setItem(EXTENSION_ID, JSON.stringify(newState));
      }
      return newState;
    }
    case SET_OPTIONS: {
      return { ...state, ...{ options: { ...state.options, ...payload } } };
    }
    default:
      return state;
  }
}
