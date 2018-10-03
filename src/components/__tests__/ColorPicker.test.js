import React from 'react';
import { mount } from 'enzyme';
import ColorPicker from '../ColorPicker';

HTMLCanvasElement.prototype.getContext = () => {};

test('renders picker color button view initially', () => {
  const picker = mount(<ColorPicker />);
  expect(picker.find('[data-testid="picker-button"]').length).toBe(1);
});

test('opens the picker dialog when clicking the button element', () => {
  const picker = mount(<ColorPicker />);
  expect(picker.find('[data-testid="picker-dialog"]').length).toBe(0);
  picker.find('[data-testid="picker-button"]').simulate('click');
  expect(picker.find('[data-testid="picker-dialog"]').length).toBe(1);
  expect(picker.find('[data-testid="picker-button"]').length).toBe(0);
});

test('closes the picker dialog when clicking outside the dialog', () => {
  const picker = mount(<ColorPicker />);
  picker.find('[data-testid="picker-button"]').simulate('click');
  const cover = picker.find('[data-testid="picker-dialog"]').childAt(0);
  cover.simulate('click');
  expect(picker.find('[data-testid="picker-button"]').length).toBe(1);
});

test('Calls the onChange handler with the current selected color', () => {
  const onChangeFn = jest.fn();
  const picker = mount(<ColorPicker defaultValue={'rgba(0, 0, 255, 0.2)'} onChange={onChangeFn} />);
  picker.find('[data-testid="picker-button"]').simulate('click');
  const input = picker.find('input').at(1);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
  expect(onChangeFn.mock.calls[0][0]).toEqual('rgba(0, 0, 255, 0.2)');
});
