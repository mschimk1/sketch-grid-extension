export default () => next => action => {
  const { type, payload } = action;
  console.groupCollapsed(type);
  console.log('Payload:', payload);
  console.groupEnd();

  return next(action);
};
