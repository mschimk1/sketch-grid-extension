import React from 'react';
import { render, cleanup } from 'react-testing-library';
import configureStore from 'redux-mock-store';

import App from '../App';

const mockStore = configureStore([]);
const store = mockStore({ options: { blockSize: 8, thickLinesEvery: 6, lightColor: '', darkColor: '' } });

afterEach(cleanup);

it('renders default grid view', () => {
  const { getByTestId } = render(<App store={store} view="" />);
  expect(getByTestId('grid')).toBeDefined();
});

it('renders popup view', () => {
  const { getByTestId } = render(<App view="popup" store={store} />);
  expect(getByTestId('popup')).toBeDefined();
});

it('renders options view', () => {
  const { getByLabelText } = render(<App view="options" store={store} />);
  const input = getByLabelText('Grid block size');
  expect(input.getAttribute('type')).toBe('number');
});
