import React from 'react';
import LayoutOptions from '../LayoutOptions';

import { mount } from 'enzyme';

test('input change calls onChange handler', () => {
  const onChangeFn = jest.fn();
  const form = mount(<LayoutOptions values={{ maxWidth: 1280 }} onInputChange={onChangeFn} />);
  const input = form.find('input').at(0);
  input.simulate('change', input);
  expect(onChangeFn).toHaveBeenCalled();
});
