// App State
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseStateReducer, isEmpty } from 'react-redux-firebase';

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
  const filteredData = [];
  switch (status) {
    case 'complete':
      repairs.map((r) => {
        if (r.status === 'done') filteredData.push(r);
        return null;
      });
      return filteredData;
    case 'incomplete':
      repairs.map((r) => {
        if (r.status !== 'approved' && r.status !== 'done') filteredData.push(r);
        return null;
      });
      return filteredData;
    default:
      return repairs;
  }
};

const filterByDateTime = (repairs, dateFrom, dateTo) => {
  if (!(repairs && dateFrom && dateTo && dateFrom <= dateTo)) return repairs;
  const filteredData = [];
  repairs.map((r) => {
    if (r.date >= dateFrom && r.date <= dateTo) filteredData.push(r);
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

export const flattenRepair = (r, id, users, assignments) => {
  if (isEmpty(r) || isEmpty(users)) return null;
  const user = users[r.user];
  const assignment = r.user ? assignments[r.user] : null;
  const date = assignment && assignment[id]
    ? assignment[id].date
    : 0;
  const repair = Object.assign({}, r, {
    id,
    user,
    date,
  });
  return repair;
};

export const flattenRepairsByUser = (repairs, users, assignments) => {
  if (isEmpty(repairs) || isEmpty(users) || isEmpty(assignments)) return [];
  const flatRepairs = [];
  Object.keys(assignments).map((akey) => {
    const a = assignments[akey];
    if (isEmpty(a)) return null;
    return Object.keys(a).map((rkey) => {
      const r = repairs[rkey];
      if (isEmpty(r)) return null;
      flatRepairs.push(flattenRepair(
        r,
        rkey,
        users,
        assignments,
      ));
      return false;
    });
  });
  return flatRepairs;
};

export const flattenAllRepairs = (repairs, users, assignments) => {
  if (isEmpty(repairs) || isEmpty(users)) return [];
  const flatRepairs = [];
  Object.keys(repairs).map((rkey) => {
    const r = repairs[rkey];
    if (isEmpty(r)) return null;
    flatRepairs.push(flattenRepair(
      r,
      rkey,
      users,
      assignments,
    ));
    return false;
  });
  return flatRepairs;
};

export const flattenRepairs = (repairs, users, assignments, role, uid) =>
  (role === 'admin'
    ? flattenAllRepairs(
      repairs,
      users,
      assignments,
    )
    : flattenRepairsByUser(
      repairs,
      users,
      Object.assign({}, { [uid]: assignments }),
    )
  );

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
