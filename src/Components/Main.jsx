import React from 'react';
import classNames from 'classnames/bind';
import styles from './Main.css';

const cx = classNames.bind(styles);

const Main = () => (
  <div className={cx('Main')}>
    <h1>This is very cool!</h1>
  </div>
);

export default Main;
