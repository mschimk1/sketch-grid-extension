/* global chrome */
import { EXTENSION_ID } from '../constants';
import GridController from '../background';

beforeEach(() => {
  chrome.storage.local.clear();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('init calls install listener', () => {
  const controller = new GridController();
  controller.init();
  expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
});

test('install listener resets storage to default settings if found', () => {
  chrome.runtime.onInstalled.addListener.mockImplementationOnce(cb => {
    cb();
  });
  chrome.storage.local.get.mockImplementationOnce(cb => {
    cb({ test: 'data', [EXTENSION_ID]: {} });
  });
  const controller = new GridController();
  controller.init();
  expect(chrome.storage.local.clear).toHaveBeenCalled();
  expect(chrome.storage.local.set).toHaveBeenCalled();
});

test('install listener does not resets storage to default values if not found', () => {
  chrome.runtime.onInstalled.addListener.mockImplementationOnce(cb => {
    cb();
  });
  chrome.storage.local.get.mockImplementationOnce(cb => {
    cb({ test: 'data' });
  });
  const controller = new GridController();
  controller.init();
  expect(chrome.storage.local.clear).toHaveBeenCalled();
  expect(chrome.storage.local.set).not.toHaveBeenCalled();
});

test('removes local storage if tab is closed', () => {
  chrome.tabs.onRemoved.addListener.mockImplementationOnce(cb => {
    cb('1234');
  });
  const controller = new GridController();
  controller.init();
  expect(chrome.storage.local.remove).toHaveBeenCalledWith('1234');
});
