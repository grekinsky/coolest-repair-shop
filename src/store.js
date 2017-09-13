import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import appState from './reducers';

const createAppStore = (initialState, history) => {
  // Create store with redux-thunk and react-router middlewares
  const store = createStore(
    appState,
    initialState,
    applyMiddleware(
      thunk,
      routerMiddleware(history),
    ),
  );
  // Enable webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default; // eslint-disable-line
      store.replaceReducer(reducers);
    });
  }
  return store;
};

export default createAppStore;
