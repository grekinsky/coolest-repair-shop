import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './Repairs.css';
import Popup from '../Shared/Popup';
import { FlatRepairList } from '../../models';
import repairActions from '../../actions/repairActions';
import UserAssignment from './UserAssignment';
import { getVisibleRepairs, flattenRepairs } from '../../reducers';
import Filters from './Filters';
import RepairRow from './RepairRow';

const cx = classNames.bind(styles);

class Repairs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignTo: '',
    };
    this.onSelectedForAssign = this.onSelectedForAssign.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
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
  showPopup(id) {
    this.setState({
      assignTo: id,
    });
  }
  render() {
    const { repairs, showIfAdmin, isAdmin, goTo } = this.props;
    const getRepairs = () => {
      if (!repairs.length) return null;
      return repairs.map(repair =>
        <RepairRow key={repair.id} repair={repair} assignTo={this.showPopup} />,
      );
    };
    return (
      <div className={cx('Repairs')}>
        <h1>Repairs</h1>
        {showIfAdmin(<button
          className={cx('Repairs-addButton')}
          onClick={() => {
            goTo('/repairs/add');
          }}
        >New Repair</button>)}
        <Filters />
        <table className={cx('Repairs-table')}>
          <thead>
            <tr>
              <th rowSpan={2}>Description</th>
              <th rowSpan={2}>Status</th>
              <th colSpan={isAdmin ? 3 : 2} className={cx('Repairs-cell--center')}>Assigned</th>
              <th rowSpan={2} className={cx('Repairs-cell--center')}>Actions</th>
            </tr>
            <tr>
              {showIfAdmin(<th>User</th>)}
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {getRepairs()}
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
  repairs: FlatRepairList,
  actions: PropTypes.shape({
    assign: PropTypes.func,
    complete: PropTypes.func,
    approve: PropTypes.func,
    reject: PropTypes.func,
  }).isRequired,
  showIfAdmin: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  goTo: PropTypes.func.isRequired,
};

Repairs.defaultProps = {
  repairs: [],
  assignments: {},
  users: {},
};

const fbStoreKey = ({ filters, role }, firebase) => [
  {
    path: '/repairs',
    storeAs: 'repairList',
    queryParams: filters.user ? ['orderByChild=user', `equalTo=${filters.user}`] : null,
  },
  {
    path: (role === 'user' ? `/assignments/${firebase._.authUid}` : '/assignments'),
    storeAs: 'assignmentList',
  },
  {
    path: '/users',
    storeAs: 'userList',
  },
];

const mapStateToProps = (
  {
    firebase: {
      data: {
        assignmentList,
        repairList,
        userList,
      },
      profile: { role },
      auth: { uid },
    },
  },
  { filters },
) => ({
  repairs: getVisibleRepairs(
    flattenRepairs(
      repairList,
      userList,
      assignmentList,
      role,
      uid,
    ),
    filters,
  ),
  isAdmin: role === 'admin',
  showIfAdmin: c => (role === 'admin' ? c : null),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
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
)(Repairs);
