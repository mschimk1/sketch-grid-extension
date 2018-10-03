import { createStore, applyMiddleware, compose } from 'redux';
import loggerMiddleware from '../utils/logger-middleware';
import reducer from './reducers';

const __PRODUCTION__ = process.env.NODE_ENV === 'production';

const defaultMiddlewares = __PRODUCTION__ ? [] : [loggerMiddleware];

const composedMiddlewares = middlewares => compose(applyMiddleware(...defaultMiddlewares, ...middlewares));

export default function configureStore(initialState, middlewares = []) {
  return createStore(reducer, initialState, composedMiddlewares(middlewares));
}
