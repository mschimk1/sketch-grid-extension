/* global chrome */
import storage from '../storage';

test('get from storage', async () => {
  await storage.get('TEST');
  expect(chrome.storage.local.get).toHaveBeenCalled();
  expect(chrome.storage.local.get.mock.calls[0][0]).toEqual('TEST');
});

test('set to storage', async () => {
  await storage.set('TEST', { key: 'value' });
  expect(chrome.storage.local.set).toHaveBeenCalled();
  expect(chrome.storage.local.set.mock.calls[0][0]).toEqual({ TEST: { key: 'value' } });
});

test('clear storage', async () => {
  await storage.clear();
  expect(chrome.storage.local.clear).toHaveBeenCalled();
});
