import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './Users.css';

const cx = classNames.bind(styles);

const Users = () => (
  <div className={cx('Users')}>
    <h1>Users</h1>
  </div>
);

Users.propTypes = {};

Users.defaultProps = {};

const mapStateToProps = (
  {
    firebase: {
      profile: { role },
    },
  },
) => ({
  role,
});

const mapDispatchToProps = () => ({});

const fbStoreKey = () => [];

export default compose(
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Users);
