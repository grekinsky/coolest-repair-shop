import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { Switch, Route, Redirect, NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import qs from 'query-string';
import styles from './Dashboard.css';
import Repairs from '../Repairs';
import RepairDetail from '../RepairDetail';
import { userIsAuthenticated } from '../../Services/User';

const cx = classNames.bind(styles);

const SidebarNavStyle = C => props => (
  <C
    className={cx('Sidebar-nav-item')}
    activeClassName={cx('Sidebar-nav-item--active')}
    {...props}
  />
);

const SidebarNavItem = SidebarNavStyle(NavLink);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  logout() {
    this.props.firebase.logout();
  }
  render() {
    const { role, displayName } = this.props;
    return (
      <div className={cx('Dashboard')}>
        <aside className={cx('Sidebar')}>
          <section className={cx('UserWelcome')}>
            <span className={cx('UserWelcome-msg')}>
              Welcome
              <strong>{` ${displayName}`}</strong>!
            </span>
            <button onClick={this.logout} className={cx('UserWelcome-logout')}>Log out</button>
          </section>
          <nav className={cx('Sidebar-nav')}>
            <SidebarNavItem to="/repairs">Repairs</SidebarNavItem>
            <SidebarNavItem to="/users">Users</SidebarNavItem>
          </nav>
        </aside>
        <section className={cx('Dashboard-main')}>
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
        </section>
      </div>
    );
  }
}

Dashboard.propTypes = {
  firebase: PropTypes.shape({
    logout: PropTypes.func,
  }).isRequired,
  role: PropTypes.string,
  displayName: PropTypes.string,
};

Dashboard.defaultProps = {
  role: '',
  displayName: '',
};

export default compose(
  userIsAuthenticated,
  firebaseConnect(),
  connect(({ firebase: { profile: { role, displayName } } }) => ({
    role,
    displayName,
  })),
)(Dashboard);
