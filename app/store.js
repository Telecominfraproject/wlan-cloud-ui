/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { createBrowserHistory } from 'history';
import { fromJS } from 'immutable';
import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

import createReducer from './reducers';

export const history = createBrowserHistory();

const initialState = {};

const sagaMiddleware = createSagaMiddleware();

// Create the store with two middlewares
// 1. sagaMiddleware: Makes redux-sagas work
// 2. routerMiddleware: Syncs the location/URL path to the state
const middlewares = [sagaMiddleware, routerMiddleware(history)];

const isReduxLogger = false;

if (process.env.NODE_ENV === 'development' && isReduxLogger) {
  // eslint-disable-next-line global-require
  const { createLogger } = require('redux-logger');

  middlewares.push(
    createLogger({
      collapsed: true,
      predicate: (getState, action) => getState && action,
    })
  );
}

const enhancers = [applyMiddleware(...middlewares)];

// If Redux DevTools Extension is installed use it, otherwise use Redux compose
/* eslint-disable no-underscore-dangle */
const composeEnhancers =
  process.env.NODE_ENV !== 'production' &&
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // TODO Try to remove when `react-router-redux` is out of beta, LOCATION_CHANGE should not be fired more than once after hot reloading
        // Prevent recomputing reducers for `replaceReducer`
        shouldHotReload: false,
      })
    : compose;
/* eslint-enable */

const store = createStore(createReducer(), fromJS(initialState), composeEnhancers(...enhancers));

// Extensions
store.runSaga = sagaMiddleware.run;
store.injectedReducers = {}; // Reducer registry
store.injectedSagas = {}; // Saga registry

// Make reducers hot reloadable
if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./reducers', () => {
    store.replaceReducer(createReducer(store.injectedReducers));
  });
}
export default store;
