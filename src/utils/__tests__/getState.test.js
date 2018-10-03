/* global chrome */
import initStorage from '../initStorage';
import createInitialState from '../createInitialState';
import getState from '../getState';

test('getState sends message to background page and resolves', async () => {
  chrome.runtime.sendMessage.mockImplementationOnce((_, cb) => cb({ test: 'data' }));
  const state = await getState();
  expect(chrome.runtime.sendMessage).toHaveBeenCalled();
  expect(state).toEqual({ test: 'data' });
});

test('getState sends message to background page and rejects', async () => {
  chrome.runtime.sendMessage.mockImplementationOnce((_, cb) => cb(null));
  expect.assertions(2);

  expect(chrome.runtime.sendMessage).toHaveBeenCalled();
  try {
    await getState();
  } catch (e) {
    expect(e).toEqual(Error('Cannot get state from background page'));
  }
});

test('getState falls back to local state if chrome runtime is not defined', async () => {
  chrome.runtime.id = false;
  const state = await getState();
  expect(state).toEqual(createInitialState(initStorage));
  chrome.runtime.id = true;
});
