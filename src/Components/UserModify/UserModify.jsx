import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './UserModify.css';

const cx = classNames.bind(styles);

const UserModify = () => (
  <div className={cx('UserModify')}>
    <h1>UserModify</h1>
  </div>
);

UserModify.propTypes = {};

UserModify.defaultProps = {};

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
)(UserModify);
