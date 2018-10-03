/* global chrome */
import { EXTENSION_ID } from '../../constants';
import {
  getOrCreateExtensionElement,
  removeExtensionElement,
  getView,
  isPopupView,
  isOptionsView,
  isContentView,
  isBackgroundPage
} from '../browser';

jest.unmock('../browser');

const document = {
  getElementById: jest.fn(),
  createElement: jest.fn(),
  body: { insertBefore: jest.fn(), childNodes: [{}] }
};

afterEach(() => {
  jest.clearAllMocks();
});

test("creates a new root div element if it doesn't exist in the DOM", () => {
  document.getElementById.mockReturnValueOnce(null);
  document.createElement.mockImplementationOnce(() => {
    const element = {};
    return element;
  });
  const extensionRoot = getOrCreateExtensionElement(document);
  expect(document.getElementById).toHaveBeenCalledWith(EXTENSION_ID);
  expect(document.createElement).toHaveBeenCalledWith('div');
  expect(extensionRoot.id).toBe(EXTENSION_ID);
  expect(document.body.insertBefore).toHaveBeenCalledWith(extensionRoot, document.body.childNodes[0]);
});

test('reuses the same root div element if it already exists in the DOM', () => {
  document.getElementById.mockReturnValueOnce({ id: EXTENSION_ID });
  const extensionRoot = getOrCreateExtensionElement(document);
  expect(extensionRoot.id).toBe(EXTENSION_ID);
  expect(document.createElement).not.toHaveBeenCalled();
});

test('Removes extension root element if it exists', () => {
  const removeChildMock = jest.fn();
  document.getElementById.mockReturnValueOnce({ id: EXTENSION_ID, parentNode: { removeChild: removeChildMock } });
  removeExtensionElement(document);
  expect(removeChildMock).toHaveBeenCalled();
});

test('getView returns the value after the hash as the view', () => {
  const location = { hash: '#popup' };
  const view = getView(location);
  expect(view).toBe('popup');
});

test('isPopupView returns true if view is popup', () => {
  const view = 'popup';
  expect(isPopupView({ view })).toBe(true);
});

test('isPopupView returns false if view is not popup', () => {
  const view = 'other';
  expect(isPopupView({ view })).toBe(false);
});

test('isOptionsView returns true if view is options', () => {
  const view = 'options';
  expect(isOptionsView({ view })).toBe(true);
});

test('isOptionsView returns false if view is not options', () => {
  const view = 'other';
  expect(isOptionsView({ view })).toBe(false);
});

test('isContentView returns true if view is blank', () => {
  const view = '';
  expect(isContentView({ view })).toBe(true);
});

test('isContentView returns false if view is not blank', () => {
  const view = 'other';
  expect(isContentView({ view })).toBe(false);
});

test('isBackgroundPage returns true if the current view is the background page', () => {
  const window = { location: { protocol: 'chrome-extension:' } };
  chrome.extension.getBackgroundPage.mockReturnValueOnce(window);
  expect(isBackgroundPage(window)).toBe(true);
});
