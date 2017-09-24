import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './UserDetail.css';

const cx = classNames.bind(styles);

const UserDetail = () => (
  <div className={cx('UserDetail')}>
    <h1>User Detail</h1>
  </div>
);

UserDetail.propTypes = {};

UserDetail.defaultProps = {};

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
)(UserDetail);
