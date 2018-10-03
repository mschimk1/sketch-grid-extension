/* global chrome */
import configureStore from 'redux-mock-store';
import GridController from '../background';

const middlewares = [];
const mockStore = configureStore(middlewares);

test('init calls message listener', () => {
  const store = mockStore({});
  const controller = new GridController(store);
  controller.init();
  expect(chrome.runtime.onMessage.addListener).toHaveBeenCalled();
});

test('update state message listener', () => {
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'updateState', state: { test: 'data' } });
  });
  const store = mockStore({});
  const controller = new GridController(store);
  const spy = jest.spyOn(controller, 'updateState');
  controller.init();
  expect(spy).toHaveBeenCalledWith({ test: 'data' });
});

test('get state message listener', () => {
  chrome.runtime.onMessage.addListener.mockImplementationOnce(cb => {
    cb({ action: 'getState' }, {}, jest.fn());
  });
  const store = mockStore({});
  const controller = new GridController(store);
  const spy = jest.spyOn(controller, 'sendState');
  controller.init();
  expect(spy).toHaveBeenCalled();
});

test('update state dispatches action', () => {
  const initialState = {};
  const store = mockStore(initialState);
  const controller = new GridController(store);
  controller.updateState({});
  const actions = store.getActions();
  const expectedPayload = { type: 'UPDATE_STATE', payload: initialState };
  expect(actions).toEqual([expectedPayload]);
});

test('send state sends the current state as the response message', () => {
  const sendResponseMock = jest.fn();
  const initialState = { test: 'data' };
  const store = mockStore(initialState);
  const controller = new GridController(store);
  controller.sendState(sendResponseMock);
  expect(sendResponseMock).toHaveBeenCalledWith(initialState);
});

test('init calls install listener', () => {
  const store = mockStore({});
  const controller = new GridController(store);
  controller.init();
  expect(chrome.runtime.onInstalled.addListener).toHaveBeenCalled();
});

test('install listener resets storage to default values', async () => {
  chrome.runtime.onInstalled.addListener.mockImplementationOnce(cb => {
    cb(Promise.resolve());
  });
  const store = mockStore({});
  const controller = new GridController(store);
  await controller.init();
  expect(chrome.storage.local.clear).toHaveBeenCalled();
  expect(chrome.storage.local.set).toHaveBeenCalled();
});
