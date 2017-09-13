import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import firebase from 'firebase';
import { reactReduxFirebase } from 'react-redux-firebase';
import appState from './reducers';
import { fbConfig } from './config/constants';

const createAppStore = (initialState, history) => {
  const rrfConfig = { userProfile: 'users' }; // react-redux-firebase config
  // initialize firebase instance
  const firebaseApp = firebase.initializeApp(fbConfig);

  const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseApp, rrfConfig), // firebase instance as first argument
  )(createStore);

  // Create store with redux-thunk and react-router middlewares
  const store = createStoreWithFirebase(
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
