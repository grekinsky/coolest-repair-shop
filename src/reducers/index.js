// App State
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseStateReducer } from 'react-redux-firebase';

const error = (state = null, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        type: action.errorType,
        detail: action.errorDetail,
      };
    case 'CLEAR_ERROR':
      return null;
    default:
      return state;
  }
};

const app = combineReducers({
  error,
  routing: routerReducer,
  firebase: firebaseStateReducer,
});

export default app;
