import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import { Repair } from '../../models';
import Comments from './Comments';

const cx = classNames.bind(styles);

class RepairDetail extends Component {
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  render() {
    const { repair, id } = this.props;
    const repairData = repair ? Object.keys(repair).map(rKey => (
      <dl key={rKey}>
        <dt>{rKey}</dt>
        <dd>{repair[rKey]}</dd>
      </dl>
    )) : '';
    return (
      <div className={cx('RepairDetail')}>
        <h2>Repair Detail</h2>
        {repairData}
        <Comments repairId={id} />
      </div>
    );
  }
}

RepairDetail.propTypes = {
  id: PropTypes.string.isRequired,
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  repair: Repair,
};

RepairDetail.defaultProps = {
  repair: null,
};

export default compose(
  firebaseConnect(({ id }) => [
    {
      path: `/repairs/${id}`,
      storeAs: 'repairDetail',
    },
  ]),
  connect(
    (
      { firebase: { data: { repairDetail }, auth } },
    ) => ({
      repair: repairDetail,
      auth,
    })),
)(RepairDetail);
