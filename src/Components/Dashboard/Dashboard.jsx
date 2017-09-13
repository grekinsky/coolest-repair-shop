import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './Dashboard.css';

const cx = classNames.bind(styles);

const Dashboard = ({ name }) => {
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
};

Dashboard.propTypes = {
  name: PropTypes.string,
};

Dashboard.defaultProps = {
  name: '',
};

export default compose(
  firebaseConnect([
    '/name', // { path: '/name' } // object notation
  ]),
  connect(
    ({ firebase: { data: { name } } }) => ({ // state.firebase.data.name
      name, // Connect props.name to state.firebase.data.name
    }),
  ),
)(Dashboard);
