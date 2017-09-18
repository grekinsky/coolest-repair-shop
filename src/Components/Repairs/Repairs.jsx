import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Repairs.css';
import { RepairList } from '../../models';
import repairActions from '../../actions/repairActions';
import UserSelector from '../UserSelector';

const cx = classNames.bind(styles);

class Repairs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignTo: '',
    };
    this.getActionsFor = (
      {
        complete,
        incomplete,
        approve,
        reject,
      },
      id,
      { status },
    ) => [
      (status === 'created')
        ? <button
          key={`assign_${id}`}
          onClick={() => {
            this.setState({
              assignTo: id,
            });
          }}
        >Assign</button>
        : '',
      (status === 'assigned'
        || status === 'working'
        || status === 'incomplete')
        ? <button
          key={`complete_${id}`}
          onClick={() => {
            complete(id);
          }}
        >Complete</button>
        : '',
      (status === 'approved'
        || status === 'assigned'
        || status === 'rejected'
        || status === 'done'
        || status === 'incomplete')
        ? <button
          key={`incomplete_${id}`}
          onClick={() => {
            incomplete(id);
          }}
        >Incomplete</button>
        : '',
      (status === 'done'
        || status === 'rejected')
        ? <button
          key={`approve_${id}`}
          onClick={() => {
            approve(id);
          }}
        >Approve</button>
        : '',
      (status === 'done'
        || status === 'approved')
        ? <button
          key={`reject_${id}`}
          onClick={() => {
            reject(id);
          }}
        >Reject</button>
        : '',
    ];
    this.onSelectedForAssign = this.onSelectedForAssign.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
  }
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  async onSelectedForAssign(userId) {
    const { actions: { assign } } = this.props;
    const { assignTo } = this.state;
    try {
      await assign(assignTo, userId);
    } catch (e) {
      console.log(e); // eslint-disable-line
    } finally {
      this.hidePopup();
    }
  }
  hidePopup() {
    this.setState({
      assignTo: '',
    });
  }
  render() {
    const { repairs, actions } = this.props;
    return (
      <div className={cx('Repairs')}>
        <h2>Repairs</h2>
        <table className={cx('Repairs-table')}>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th rowSpan={2}>Status</th>
              <th colSpan={3}>Assigned</th>
              <th rowSpan={2}>Actions</th>
            </tr>
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(repairs).map((rKey) => {
              const repair = repairs[rKey];
              return (
                <tr key={rKey}>
                  <td>
                    <NavLink exact to={`/repairs/${rKey}`}>
                      {repair.description}
                    </NavLink>
                  </td>
                  <td>{repair.status}</td>
                  <td>
                    {repair.user !== '0'
                      ? repair.user.displayName
                      : '(not assigned)'}
                  </td>
                  <td>
                    {repair.user !== '0'
                      ? repair.date
                      : '-'}
                  </td>
                  <td>
                    {repair.user !== '0'
                      ? repair.time
                      : '-'}
                  </td>
                  <td>
                    <div>
                      {this.getActionsFor(actions, rKey, repair)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {this.state.assignTo
          ? <UserSelector
            onSelected={this.onSelectedForAssign}
            onClose={this.hidePopup}
          /> : ''
        }
      </div>
    );
  }
}

Repairs.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  repairs: RepairList,
  actions: PropTypes.shape({
    assign: PropTypes.func,
    complete: PropTypes.func,
    approve: PropTypes.func,
    reject: PropTypes.func,
  }).isRequired,
};

Repairs.defaultProps = {
  repairs: {},
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
});

const populates = [
  { child: 'user', root: 'users' },
];

export default compose(
  firebaseConnect([
    {
      path: '/repairs',
      storeAs: 'repairList',
      populates,
    },
  ]),
  connect(
    ({ firebase }) => ({
      repairs: populate(firebase, 'repairList', populates),
      auth: firebase.auth,
    }),
    mapDispatchToProps,
  ),
)(Repairs);
