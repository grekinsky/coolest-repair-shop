import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, populate, isEmpty } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Repairs.css';
import Popup from '../Shared/Popup';
import { RepairList } from '../../models';
import repairActions from '../../actions/repairActions';
import UserAssignment from './UserAssignment';
import { getVisibleRepairs } from '../../reducers';
import { extractHoursFromDate, dateFormat, timeFormat } from '../../util';
import { DATE_FORMAT } from '../../config/constants';
import Filters from './Filters';

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
  async onSelectedForAssign(userId, date) {
    const { actions: { assign } } = this.props;
    const { assignTo } = this.state;
    try {
      await assign(assignTo, userId, date);
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
        <Filters />
        <table className={cx('Repairs-table')}>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th rowSpan={2}>Status</th>
              <th colSpan={3}>Assigned to</th>
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
              const d = !isEmpty(repair.user) ? extractHoursFromDate(repair.date) : null;
              return (
                <tr key={rKey}>
                  <td>
                    <NavLink exact to={`/repairs/${rKey}`}>
                      {repair.description}
                    </NavLink>
                  </td>
                  <td>{repair.status}</td>
                  <td>
                    {!isEmpty(repair.user)
                      ? repair.user.displayName
                      : '(not assigned)'}
                  </td>
                  <td>
                    {!isEmpty(repair.user)
                      ? dateFormat(d.date, DATE_FORMAT)
                      : '-'}
                  </td>
                  <td>
                    {!isEmpty(repair.user)
                      ? timeFormat(d.h)
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
          ? (
            <Popup onClose={this.hidePopup} wide={false}>
              <UserAssignment
                onApply={this.onSelectedForAssign}
              />
            </Popup>
          ) : ''
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
  firebaseConnect(({ filters }) => [{
    path: '/repairs',
    storeAs: 'repairList',
    queryParams: filters.user ? ['orderByChild=user', `equalTo=${filters.user}`] : null,
    populates,
  }]),
  connect(
    ({ firebase }, { filters }) => ({
      repairs: getVisibleRepairs(populate(firebase, 'repairList', populates), filters),
      auth: firebase.auth,
    }),
    mapDispatchToProps,
  ),
)(Repairs);
