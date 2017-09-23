import React from 'react';
import classNames from 'classnames/bind';
import styles from './Users.css';

const cx = classNames.bind(styles);

const Users = () => (
  <div className={cx('Users')}>
    <h1>Users</h1>
  </div>
);

export default Users;
