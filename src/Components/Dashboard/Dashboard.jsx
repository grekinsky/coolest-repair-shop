import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import { Switch, Route, Redirect } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Dashboard.css';
import Repairs from '../Repairs';
import RepairDetail from '../RepairDetail';

const cx = classNames.bind(styles);

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  logout() {
    this.props.firebase.logout();
  }
  render() {
    const { name } = this.props;
    /* eslint-disable no-nested-ternary */
    const displayName = !isLoaded(name)
      ? 'Loading...'
      : isEmpty(name)
        ? '(Name)'
        : name;
    return (
      <div className={cx('Dashboard')}>
        <h1>Hello {displayName}!</h1>
        <p><button onClick={this.logout}>Log out</button></p>
        <Switch>
          <Route exact path="/repairs" component={Repairs} />
          <Route
            exact
            path="/repairs/:id"
            render={({ match }) => (
              <RepairDetail id={match.params.id} />
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
  name: PropTypes.string,
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  goTo: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  name: '',
};

const mapDispatchToProps = dispatch => ({
  goTo: (route) => {
    dispatch(push(route));
  },
});

export default compose(
  firebaseConnect([
    '/name', // { path: '/name' } // object notation
  ]),
  connect(
    ({ firebase: { data: { name }, auth } }) => ({ // state.firebase.data.name
      name, // Connect props.name to state.firebase.data.name
      auth,
    }), mapDispatchToProps),
)(Dashboard);
