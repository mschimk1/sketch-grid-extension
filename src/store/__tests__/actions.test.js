import * as actions from '../actions';
import { LOCAL_STORAGE_KEY } from '../../constants';

test('creates an UPDATE_STATE action', () => {
  const state = { [LOCAL_STORAGE_KEY]: true };
  const expectedAction = {
    type: actions.UPDATE_STATE,
    payload: state
  };
  expect(actions.updateState(state)).toEqual(expectedAction);
});

test('creates a SET_OPTIONS action', () => {
  const options = { state: { options: {}, [LOCAL_STORAGE_KEY]: true } };
  const expectedAction = {
    type: actions.SET_OPTIONS,
    payload: options
  };
  expect(actions.setOptions(options)).toEqual(expectedAction);
});

test('toggleGrid creates an UPDATE_STATE action', () => {
  const expectedAction = {
    type: actions.UPDATE_STATE,
    payload: { [LOCAL_STORAGE_KEY]: true }
  };
  expect(actions.toggleGrid(false)).toEqual(expectedAction);
});

test('initTab creates an INIT_TAB action', () => {
  const expectedAction = {
    type: actions.INIT_TAB,
    payload: 1234
  };
  expect(actions.initTab(1234)).toEqual(expectedAction);
});
