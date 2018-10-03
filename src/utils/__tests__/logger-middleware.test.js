import loggerMiddleware from '../logger-middleware';

test('middleware logs the action details', () => {
  const consoleGroupStartSpy = jest.spyOn(console, 'groupCollapsed');
  const consoleGroupEndSpy = jest.spyOn(console, 'groupEnd');
  const consoleLogSpy = jest.spyOn(console, 'log');
  const fakeNext = jest.fn();
  const fakeAction = { type: 'SOME_ACTION', payload: 'test' };
  loggerMiddleware()(fakeNext)(fakeAction);
  expect(consoleGroupStartSpy).toHaveBeenCalledWith('SOME_ACTION');
  expect(consoleLogSpy.mock.calls[0]).toEqual(['Payload:', 'test']);
  expect(consoleGroupEndSpy).toHaveBeenCalled();
});
