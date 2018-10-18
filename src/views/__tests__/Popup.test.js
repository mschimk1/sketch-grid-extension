import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';

import Popup from '../Popup';
import { SET_OPTIONS } from '../../store/actions';
import { LOCAL_STORAGE_KEY } from '../../constants';

const mockStore = configureStore([]);
let store = mockStore({});

test('renders the popup', () => {
  const popupContainer = mount(<Popup store={store} />);
  expect(popupContainer.find('[data-testid="popup"]')).toBeDefined();
});

test('Switch toggles grid visibility', () => {
  store = mockStore({ [LOCAL_STORAGE_KEY]: false });
  let popupContainer = mount(<Popup store={store} />);
  let input = popupContainer.find('input').at(0);
  input.simulate('change', { target: { checked: true } });
  const expectedEnableAction = { type: 'UPDATE_STATE', payload: { 'Grid.Visible': true } };
  expect(store.getActions()).toEqual([expectedEnableAction]);

  store = mockStore({ [LOCAL_STORAGE_KEY]: true });
  popupContainer = mount(<Popup store={store} />);
  input = popupContainer.find('input').at(0);
  const expectedDisableAction = { type: 'UPDATE_STATE', payload: { 'Grid.Visible': false } };
  input.simulate('change', { target: { checked: false } });
  expect(store.getActions()).toEqual([expectedDisableAction]);
});

test('dispatches setOptions action if options form values change', () => {
  store = mockStore({ options: { blockSize: 12 } });
  const popupContainer = mount(<Popup store={store} />);
  const settingsButton = popupContainer.find('button').at(1);
  settingsButton.simulate('click');
  const input = popupContainer
    .find('GridOptionsForm')
    .find('input')
    .at(0);
  input.simulate('change', input);
  const expectedAction = { type: SET_OPTIONS, payload: { blockSize: '12' } };
  expect(store.getActions()).toEqual([expectedAction]);
});

test('Toggles help section when click the help icon button', () => {
  const popupContainer = mount(<Popup store={store} />);
  expect(
    popupContainer
      .find('Collapse')
      .at(0)
      .prop('in')
  ).toBe(false);
  const helpButton = popupContainer.find('HelpOutlineIcon');
  helpButton.simulate('click');
  expect(
    popupContainer
      .find('Collapse')
      .at(0)
      .prop('in')
  ).toBe(true);
});

test('Toggles options section when click the settings icon', () => {
  const popupContainer = mount(<Popup store={store} />);
  expect(
    popupContainer
      .find('Collapse')
      .at(1)
      .prop('in')
  ).toBe(false);
  const settingsButton = popupContainer.find('SettingsIcon');
  settingsButton.simulate('click');
  expect(
    popupContainer
      .find('Collapse')
      .at(1)
      .prop('in')
  ).toBe(true);
});
