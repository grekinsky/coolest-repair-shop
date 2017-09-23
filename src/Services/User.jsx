import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { replace } from 'react-router-redux';
import Loading from '../Components/Shared/Loading';

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedReduxRedirect({
  wrapperDisplayName: 'UserIsAuthenticated',
  redirectPath: '/login',
  redirectAction: replace,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth && auth.isLoaded && !auth.isEmpty,
  authenticatingSelector: ({ firebase: { auth } }) =>
    auth === undefined || !auth.isLoaded,
  AuthenticatingComponent: Loading,
});

export const userIsNotAuthenticated = connectedReduxRedirect({
  wrapperDisplayName: 'UserIsNotAuthenticated',
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  redirectAction: replace,
  authenticatedSelector: ({ firebase: { auth } }) =>
    !(auth && auth.isLoaded && !auth.isEmpty),
  authenticatingSelector: ({ firebase: { auth } }) =>
    auth === undefined || !auth.isLoaded,
  AuthenticatingComponent: Loading,
});

export const userRole = role => connectedReduxRedirect({
  wrapperDisplayName: 'UserRole',
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/forbidden',
  allowRedirectBack: false,
  redirectAction: replace,
  authenticatedSelector: ({ firebase: { auth } }) =>
    (auth && auth.isLoaded && !auth.isEmpty) && auth.role === role,
  authenticatingSelector: ({ firebase: { auth } }) =>
    auth === undefined || !auth.isLoaded,
  AuthenticatingComponent: Loading,
});
