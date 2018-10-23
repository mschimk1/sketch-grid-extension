import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import initStorage from '../../utils/initStorage';
import { SET_OPTIONS, UPDATE_STATE } from '../../store/actions';
import Options from '../Options';

const mockStore = configureStore([]);

test('dispatches setOptions action if options form values change', () => {
  const store = mockStore({ options: { blockSize: 12 } });
  const options = mount(<Options store={store} />);
  const input = options.find('input').at(0);
  input.simulate('change', input);
  const expectedAction = { type: SET_OPTIONS, payload: { blockSize: '12' } };
  expect(store.getActions()).toEqual([expectedAction]);
});

test('dispatches updateState action when clicking Restore Defaults button', () => {
  const store = mockStore({ options: { blockSize: 12 } });
  const gridOptions = mount(<Options store={store} />);
  const restoreButton = gridOptions.find('button').at(2);
  restoreButton.simulate('click');
  const { options } = initStorage;
  const expectedAction = { type: UPDATE_STATE, payload: { options } };
  expect(store.getActions()).toEqual([expectedAction]);
});
