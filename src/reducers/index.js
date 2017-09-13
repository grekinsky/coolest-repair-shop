// App State
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

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

const name = (state = 'John Doe', action) => {
  switch (action.type) {
    case 'SET_NAME':
      return action.name;
    case 'CLEAR_NAME':
      return '';
    default:
      return state;
  }
};

const app = combineReducers({
  error,
  name,
  routing: routerReducer,
});

export default app;
