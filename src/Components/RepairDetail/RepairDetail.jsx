import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { replace } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import { FlatRepair } from '../../models';
import Comments from './Comments';
import { flattenRepair } from '../../reducers';
import { dateTimeFormat } from '../../util';

const cx = classNames.bind(styles);

class RepairDetail extends Component {
  componentWillReceiveProps({ redirect, role, repairUser, auth }) {
    if (role === 'user' && !isEmpty(repairUser) && auth.uid !== repairUser) {
      redirect('/forbidden');
    }
  }
  render() {
    const { repair, id } = this.props;
    return !isEmpty(repair) ? (
      <div className={cx('RepairDetail')}>
        <h1>Repair Detail</h1>
        <blockquote>
          <p>{repair.description}</p>
        </blockquote>
        <dl>
          <dt>Created</dt>
          <dd>{dateTimeFormat(repair.timestamp)}</dd>
          <dt>Status</dt>
          <dd>{repair.status}</dd>
        </dl>
        {repair.user ? (
          <dl>
            <dt>Assigned to</dt>
            <dd>{repair.user.displayName}</dd>
            <dt>Assigned date</dt>
            <dd>{dateTimeFormat(repair.date)}</dd>
          </dl>
        ) : null}
        <Comments repairId={id} />
      </div>
    ) : null;
  }
}

RepairDetail.propTypes = {
  id: PropTypes.string.isRequired,
  repair: FlatRepair,
  redirect: PropTypes.func.isRequired,
};

RepairDetail.defaultProps = {
  repair: null,
};

const fbStoreKey = ({ id }) => [
  {
    path: `/repairs/${id}`,
    storeAs: 'repairDetail',
  },
  {
    path: '/users',
    storeAs: 'userList',
  },
  {
    path: '/assignments',
    storeAs: 'assignmentList',
  },
];

const mapStateToProps = (
  { firebase: {
    auth: { uid },
    profile: {
      role,
    },
    data: {
      repairDetail,
      userList,
      assignmentList,
    },
  } },
  { id },
) => ({
  uid,
  role,
  repair: flattenRepair(
    repairDetail,
    id,
    userList,
    assignmentList,
  ),
  repairUser: repairDetail ? repairDetail.user : '',
  assignments: assignmentList,
});

const mapDispatchToProps = dispatch => ({
  redirect: (route) => {
    dispatch(replace(route));
  },
});

export default compose(
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RepairDetail);
