import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import { Repair } from '../../models';
import Comments from './Comments';
import { dateTimeFormat } from '../../util';

const cx = classNames.bind(styles);

class RepairDetail extends Component {
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  render() {
    const { repair, id } = this.props;
    return (
      <div className={cx('RepairDetail')}>
        <h2>Repair Detail</h2>
        <dl>
          <dt>Description</dt>
          <dd>{repair.description}</dd>
          <dt>Created</dt>
          <dd>{dateTimeFormat(repair.timestamp)}</dd>
          <dt>Status</dt>
          <dd>{repair.status}</dd>
          <dt>Assigned to</dt>
          <dd>{repair.user.displayName}</dd>
          <dt>Assigned date</dt>
          <dd>{dateTimeFormat(repair.date)}</dd>
        </dl>
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

const populates = [
  { child: 'user', root: 'users' },
];

export default compose(
  firebaseConnect(({ id }) => [
    {
      path: `/repairs/${id}`,
      storeAs: 'repairDetail',
      populates,
    },
  ]),
  connect(
    (
      { firebase },
    ) => ({
      repair: populate(firebase, 'repairDetail', populates),
      auth: firebase.auth,
    })),
)(RepairDetail);
