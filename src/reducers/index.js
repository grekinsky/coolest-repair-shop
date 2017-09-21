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

const filterByStatus = (repairs, status) => {
  if (!(repairs && status)) return repairs;
  const filteredData = {};
  switch (status) {
    case 'complete':
      Object.keys(repairs).map((rKey) => {
        const r = repairs[rKey];
        if (r.status === 'done') filteredData[rKey] = r;
        return null;
      });
      return filteredData;
    case 'incomplete':
      Object.keys(repairs).map((rKey) => {
        const r = repairs[rKey];
        if (r.status !== 'approved' && r.status !== 'done') filteredData[rKey] = r;
        return null;
      });
      return filteredData;
    default:
      return repairs;
  }
};

const filterByDateTime = (repairs, dateFrom, dateTo) => {
  if (!(repairs && dateFrom && dateTo && dateFrom <= dateTo)) return repairs;
  const filteredData = {};
  Object.keys(repairs).map((rKey) => {
    const r = repairs[rKey];
    if (r.date >= dateFrom && r.date <= dateTo) filteredData[rKey] = r;
    return null;
  });
  return filteredData;
};

export const getVisibleRepairs = (repairs, filters) => {
  if (!(repairs && filters)) return repairs;
  let filteredData = repairs;
  filteredData = filterByStatus(filteredData, filters.status);
  filteredData = filterByDateTime(
    filteredData,
    filters.dateFrom,
    filters.dateTo,
  );
  return filteredData;
};

export const getVisibleUsers = (users, filter) => {
  if (!(users && filter && filter.length > 1)) return users;
  const filteredData = {};
  const f = filter;
  Object.keys(users).map((uKey) => {
    const u = users[uKey];
    const displayName = u.displayName.toLowerCase();
    const email = u.email.toLowerCase();
    const lKey = uKey.toLowerCase();
    if (displayName.includes(f)
      || email.includes(f)
      || lKey.includes(f)
    ) {
      filteredData[uKey] = u;
    }
    return null;
  });
  return filteredData;
};

export default app;
