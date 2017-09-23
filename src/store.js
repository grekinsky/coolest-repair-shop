import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import firebase from 'firebase';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import appState from './reducers';
import { getFbConfig, ENV } from './config/constants';

const createAppStore = (initialState, history) => {
  const rrfConfig = {
    userProfile: 'users',
    profileParamsToPopulate: [
      ['role:roles'], // populates user's role with matching role object from roles
    ],
    profileFactory: user => ({
      email: user.email || user.providerData[0].email,
      role: user.role || 'user',
      providerData: user.providerData,
      displayName: user.displayName || user.providerData[0].displayName,
    }),
  }; // react-redux-firebase config
  // initialize firebase instance
  const firebaseApp = firebase.initializeApp(getFbConfig(ENV));

  const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseApp, rrfConfig), // firebase instance as first argument
  )(createStore);

  // Create store with redux-thunk and react-router middlewares
  const store = createStoreWithFirebase(
    appState,
    initialState,
    applyMiddleware(
      thunk.withExtraArgument(getFirebase),
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
