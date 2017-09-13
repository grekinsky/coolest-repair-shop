// Common actions

import { ERROR_GENERAL } from '../config/constants';

const commonActions = {
  setError: errorDetail => ({
    type: 'SET_ERROR',
    errorType: ERROR_GENERAL,
    errorDetail,
  }),
  clearError: () => ({
    type: 'CLEAR_ERROR',
  }),
  setName: name => ({
    type: 'SET_NAME',
    name,
  }),
  clearName: () => ({
    type: 'CLEAR_NAME',
  }),
};

export default commonActions;
