import React from 'react';
import { mount } from 'enzyme';

import GridOptionsForm from '../GridOptionsForm';

HTMLCanvasElement.prototype.getContext = () => {};

test('Renders action buttons in full view only', () => {
  const form = mount(<GridOptionsForm view={'options'} />);
  expect(form.find('button').text()).toBe('Restore Defaults');
});

test('calls onChange handler when changing block size', () => {
  const onChangeFn = jest.fn();
  const form = mount(<GridOptionsForm onChange={onChangeFn} />);
  const input = form.find('input').at(0);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
});

test('calls onChange handler when changing color', () => {
  const onChangeFn = jest.fn();
  const form = mount(<GridOptionsForm values={{ darkColor: 'rgba(0, 0, 0, 1)' }} onChange={onChangeFn} />);
  // open dialog
  form
    .find('[data-testid="picker-button"]')
    .at(0)
    .simulate('click');
  // change first input
  const input = form
    .find('ColorPicker')
    .at(0)
    .find('input')
    .at(0);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
  expect(onChangeFn.mock.calls[0][0].target.name).toBe('darkColor');
  expect(onChangeFn.mock.calls[0][0].target.value).toBe('rgba(0, 0, 0, 1)');
});
