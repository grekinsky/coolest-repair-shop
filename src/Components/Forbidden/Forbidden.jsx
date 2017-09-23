import React from 'react';
import classNames from 'classnames/bind';
import styles from './Forbidden.css';

const cx = classNames.bind(styles);

const Forbidden = () => (
  <div className={cx('Forbidden')}>
    <h1>Forbidden</h1>
    <p>You are not allowed to access this page.</p>
  </div>
);

export default Forbidden;
