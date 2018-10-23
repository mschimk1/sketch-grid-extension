import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from '../utils/logger-middleware';
import { INIT } from './actions';
import reducer from './reducers';

const __PRODUCTION__ = process.env.NODE_ENV === 'production';

const defaultMiddlewares = __PRODUCTION__ ? [] : [loggerMiddleware];

const middlewares = applyMiddleware(...defaultMiddlewares);

export const enhancedStore = (callback = () => {}) => createStore => (reducer, initialState) => {
  const store = createStore(reducer, initialState, middlewares);
  store.dispatch({
    type: INIT,
    store,
    callback
  });
  return store;
};

export default function configureStore(initialState, callback) {
  return enhancedStore(callback)(createStore)(reducer, initialState);
}
