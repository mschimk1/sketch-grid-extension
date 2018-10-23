import React from 'react';
import GridOptions from '../GridOptions';

import { mount } from 'enzyme';

HTMLCanvasElement.prototype.getContext = () => {};

test('calls onChange handler when changing block size', () => {
  const onChangeFn = jest.fn();
  const options = mount(<GridOptions values={{ blockSize: 8 }} onInputChange={onChangeFn} onColorChange={jest.fn()} />);
  const input = options.find('input').at(0);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
});

test('calls onChange handler when changing color', () => {
  const onChangeFn = jest.fn();
  const options = mount(
    <GridOptions values={{ darkColor: 'rgba(0, 0, 0, 1)' }} onInputChange={jest.fn()} onColorChange={onChangeFn} />
  );
  // open dialog
  options
    .find('[data-testid="picker-button"]')
    .at(0)
    .simulate('click');
  // change first input
  const input = options
    .find('ColorPicker')
    .at(0)
    .find('input')
    .at(0);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
  expect(onChangeFn.mock.calls[0][0].target.name).toBe('darkColor');
  expect(onChangeFn.mock.calls[0][0].target.value).toBe('rgba(0, 0, 0, 1)');
});
