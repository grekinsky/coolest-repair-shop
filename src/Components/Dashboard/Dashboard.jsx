import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { Switch, Route, Redirect } from 'react-router-dom';
import classNames from 'classnames/bind';
import qs from 'query-string';
import styles from './Dashboard.css';
import Repairs from '../Repairs';
import RepairDetail from '../RepairDetail';
import { userIsAuthenticated } from '../../Services/User';

const cx = classNames.bind(styles);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout() {
    this.props.firebase.logout();
  }
  render() {
    const { role } = this.props;
    return (
      <div className={cx('Dashboard')}>
        <h1>My coolest repair shop</h1>
        <p><button onClick={this.logout}>Log out</button></p>
        <Switch>
          <Route
            exact
            path="/repairs"
            render={({ location }) =>
              (!isEmpty(role) ? (
                <Repairs
                  filters={qs.parse(location.search)}
                  role={role}
                />
              ) : null)}
          />
          <Route
            exact
            path="/repairs/:id"
            render={({ match }) => (
              <RepairDetail
                id={match.params.id}
              />
            )}
          />
          <Redirect exact from="/" to="/repairs" />
        </Switch>
      </div>
    );
  }
}

Dashboard.propTypes = {
  firebase: PropTypes.shape({
    logout: PropTypes.func,
  }).isRequired,
  role: PropTypes.string,
};

Dashboard.defaultProps = {
  role: '',
};

export default compose(
  userIsAuthenticated,
  firebaseConnect(),
  connect(({ firebase: { profile: { role } } }) => ({
    role,
  })),
)(Dashboard);
