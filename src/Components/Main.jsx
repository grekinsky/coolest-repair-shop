/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import Dashboard from './Dashboard';

const Main = ({
  store,
  history,
}) => (
  <Provider store={store}>
    <Router history={history}>
      <Route path="/" component={Dashboard} />
    </Router>
  </Provider>
);

Main.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
};

export default Main;
