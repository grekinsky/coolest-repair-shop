import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './UserAdd.css';

const cx = classNames.bind(styles);

const UserAdd = () => (
  <div className={cx('UserAdd')}>
    <h1>Add User</h1>
  </div>
);

UserAdd.propTypes = {};

UserAdd.defaultProps = {};

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
)(UserAdd);
