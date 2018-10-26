import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from '../utils/logger-middleware';
import { INIT } from './actions';
import reducer from './reducers';

const __PRODUCTION__ = process.env.NODE_ENV === 'production';

const defaultMiddlewares = __PRODUCTION__ ? [] : [loggerMiddleware];

const middlewares = applyMiddleware(...defaultMiddlewares);

export const enhancedStore = ({ tabId, onInit = () => {} }) => createStore => (reducer, initialState) => {
  const store = createStore(reducer, initialState, middlewares);
  store.dispatch({
    type: INIT,
    store,
    tabId,
    onInit
  });
  return store;
};

export default function configureStore(initialState, options) {
  return enhancedStore(options)(createStore)(reducer, initialState);
}
