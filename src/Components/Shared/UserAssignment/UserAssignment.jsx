import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import TimeInput from '../../Shared/TimeInput';
import {
  dateFormat,
  extractHoursFromDate,
  setHoursToDate,
} from '../../../util';
import { getVisibleUsers } from '../../../Services/Filters';
import { UserList } from '../../../models';
import { DATE_FORMAT } from '../../../config/constants';
import styles from './UserAssignment.css';
import assignmentActions from '../../../actions/assignmentActions';
import commonActions from '../../../actions/commonActions';

const cx = classNames.bind(styles);

class UserAssignment extends Component {
  constructor(props) {
    super(props);
    const today = extractHoursFromDate(moment());
    this.state = {
      userInput: '',
      user: null,
      date: today.date,
      time: today.h,
    };
    const { comActions, assignActions } = props;
    this.isDateAvailable = async (date) => {
      try {
        await assignActions.isDateAvailable(date);
        comActions.clearError();
        return true;
      } catch (e) {
        comActions.setError(e.message);
        return false;
      }
    };
  }
  render() {
    const { users, onApply } = this.props;
    if (this.state.user) {
      return (
        <div>
          <div>
            {users[this.state.user].displayName}
          </div>
          <div>
            <DayPickerInput
              value={dateFormat(this.state.date, DATE_FORMAT)}
              placeholder={DATE_FORMAT}
              onDayChange={(selectedDay) => {
                const date = selectedDay.valueOf();
                const d = setHoursToDate(date, this.state.time);
                this.isDateAvailable(d);
                this.setState({
                  date,
                });
              }}
            />
          </div>
          <div>
            <TimeInput
              value={this.state.time}
              onChange={(selectedTime) => {
                const d = setHoursToDate(this.state.date, selectedTime);
                this.isDateAvailable(d);
                this.setState({
                  time: selectedTime,
                });
              }}
            />
          </div>
          <div>
            <button
              onClick={async () => {
                const date = setHoursToDate(this.state.date, this.state.time);
                try {
                  if (await this.isDateAvailable(date)) {
                    onApply(
                      this.state.user,
                      date,
                    );
                  }
                } catch (e) {
                  return false;
                }
                return true;
              }}
            >Apply</button>
          </div>
        </div>
      );
    }
    const filteredUsers = getVisibleUsers(users, this.state.userInput);
    const usersData = !isEmpty(filteredUsers)
      ? Object.keys(filteredUsers).splice(0, 10).map(cKey => (
        <li key={cKey}>
          <a
            href=""
            onClick={(e) => {
              e.preventDefault();
              this.setState({
                user: cKey,
              });
            }}
          >
            {filteredUsers[cKey].displayName}
          </a>
        </li>
      ))
      : '';
    return (
      <div className={cx('UserAssignment')}>
        <h3>Assign to user:</h3>
        <input
          className={cx('UserAssignment-searchField')}
          onChange={(e) => {
            this.setState({
              userInput: e.target.value,
            });
          }}
        />
        <ul className={cx('UserAssignment-list')}>
          {usersData}
        </ul>
      </div>
    );
  }
}

UserAssignment.propTypes = {
  comActions: PropTypes.shape({
    setError: PropTypes.func,
    clearError: PropTypes.func,
  }).isRequired,
  assignActions: PropTypes.shape({
    isDateAvailable: PropTypes.func,
  }).isRequired,
  users: UserList,
  onApply: PropTypes.func.isRequired,
};

UserAssignment.defaultProps = {
  users: null,
  onApply: () => {},
};

const mapStateToProps = (
  { firebase: { data: { userList } } },
) => ({
  users: userList,
});

const mapDispatchToProps = dispatch => ({
  comActions: bindActionCreators(commonActions, dispatch),
  assignActions: bindActionCreators(assignmentActions, dispatch),
});

const fbStoreKey = () => [
  {
    path: '/users',
    storeAs: 'userList',
  },
];

export default compose(
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserAssignment);
