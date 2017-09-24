import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { replace } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import { Repair } from '../../models';
import Comments from './Comments';
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
          <dt>Assigned to</dt>
          <dd>{repair.user}</dd>
          <dt>Assigned date</dt>
          <dd>{dateTimeFormat(repair.date)}</dd>
        </dl>
        <Comments repairId={id} />
      </div>
    ) : null;
  }
}

RepairDetail.propTypes = {
  id: PropTypes.string.isRequired,
  repair: Repair,
  redirect: PropTypes.func.isRequired,
};

RepairDetail.defaultProps = {
  repair: null,
};

const mapDispatchToProps = dispatch => ({
  redirect: (route) => {
    dispatch(replace(route));
  },
});

export default compose(
  firebaseConnect(({ id }) => [
    {
      path: `/repairs/${id}`,
      storeAs: 'repairDetail',
    },
    {
      path: `/repairs/${id}/user`,
      storeAs: 'repairUser',
    },
  ]),
  connect(
    (
      { firebase },
    ) => ({
      repair: firebase.data.repairDetail,
      auth: firebase.auth,
      role: firebase.profile.role,
      repairUser: firebase.data.repairUser,
    }), mapDispatchToProps),
)(RepairDetail);
