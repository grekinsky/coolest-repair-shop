import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { replace, push } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import repairActions from '../../actions/repairActions';
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
    const { repair, id, showIfAdmin, goTo, actions } = this.props;
    return !isEmpty(repair) ? (
      <div className={cx('RepairDetail')}>
        <h1>Repair Detail</h1>
        {showIfAdmin(<button
          className={cx('Repairs-addButton')}
          onClick={() => {
            goTo(`/repairs/${id}/edit`);
          }}
        >Modify</button>)}
        {showIfAdmin(<button
          className={cx('Repairs-removeButton')}
          onClick={async () => {
            await actions.remove(id);
            goTo('/repairs');
          }}
        >Delete</button>)}
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
  actions: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  id: PropTypes.string.isRequired,
  repair: FlatRepair,
  redirect: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
  showIfAdmin: PropTypes.func.isRequired,
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
  showIfAdmin: c => (role === 'admin' ? c : null),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
  redirect: (route) => {
    dispatch(replace(route));
  },
  goTo: (path) => {
    dispatch(push(path));
  },
});

export default compose(
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RepairDetail);
