import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './Dashboard.css';

const cx = classNames.bind(styles);

class Dashboard extends Component {
  componentWillReceiveProps({ auth, redirectToLogin }) {
    if (auth && !auth.uid) {
      redirectToLogin();
    }
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
      </div>
    );
  }
}

Dashboard.propTypes = {
  name: PropTypes.string,
  auth: PropTypes.object, // eslint-disable-line
  redirectToLogin: PropTypes.func.isRequired,
};

Dashboard.defaultProps = {
  name: '',
};

const mapDispatchToProps = dispatch => ({
  redirectToLogin: () => {
    dispatch(push('/login'));
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
