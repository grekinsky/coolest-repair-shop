import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Dashboard.css';

const cx = classNames.bind(styles);

const Dashboard = ({ name }) => (
  <div className={cx('Dashboard')}>
    <h1>Hello {name}!</h1>
  </div>
);

Dashboard.propTypes = {
  name: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  name: state.name,
});

export default connect(
  mapStateToProps,
  null,
)(Dashboard);
