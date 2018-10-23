import React from 'react';
import { mount } from 'enzyme';

import GridOptionsForm from '../GridOptionsForm';

let form;

beforeEach(() => {
  form = mount(
    <GridOptionsForm view={'options'} values={{ blockSize: 8, thickLinesEvery: 6, lightColor: '', darkColor: '' }} />
  );
});

test('Changes the currently active tab', () => {
  const layoutTabBtn = form.find('button').at(1);
  expect(layoutTabBtn.text()).toBe('Layout');
  expect(form.find('Tabs').prop('value')).toBe(0);

  layoutTabBtn.simulate('click');

  expect(form.find('Tabs').prop('value')).toBe(1);
});

test('Renders action buttons in full view only', () => {
  expect(
    form
      .find('button')
      .at(2)
      .text()
  ).toBe('Restore Defaults');
});
