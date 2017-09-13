/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './Dashboard';
import Login from './Login';

const Main = ({
  store,
  history,
}) => (
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Route exact path="/" component={Dashboard} />
        <Route exact path="/login" component={Login} />
      </div>
    </Router>
  </Provider>
);

Main.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default Main;
