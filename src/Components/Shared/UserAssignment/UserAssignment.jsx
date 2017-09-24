import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty, getFirebase } from 'react-redux-firebase';
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
      error: '',
    };
    this.isDateAvailable = date =>
      new Promise((resolve, reject) => {
        try {
          const repairsRef = getFirebase().ref('assignments');
          repairsRef.once('value', (snapshot) => {
            const res = !snapshot.forEach(user =>
              user.forEach(repair =>
                repair.child('date').val() === date));
            this.setState({
              error: !res ? 'Date is unavailable' : '',
            });
            resolve(res);
          });
        } catch (e) {
          reject(e);
        }
      });
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
              onDayChange={async (selectedDay) => {
                const date = selectedDay.valueOf();
                const d = setHoursToDate(date, this.state.time);
                await this.isDateAvailable(d);
                this.setState({
                  date,
                });
              }}
            />
          </div>
          <div>
            <TimeInput
              value={this.state.time}
              onChange={async (selectedTime) => {
                const d = setHoursToDate(this.state.date, selectedTime);
                await this.isDateAvailable(d);
                this.setState({
                  time: selectedTime,
                });
              }}
            />
          </div>
          <div style={{ color: this.state.error ? '#990000' : '#009900' }}>
            {this.state.error}
          </div>
          <div>
            <button
              onClick={async () => {
                const date = setHoursToDate(this.state.date, this.state.time);
                const isAvailable = await this.isDateAvailable(date);
                if (!isAvailable) {
                  return false;
                }
                onApply(
                  this.state.user,
                  date,
                );
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
  users: UserList,
  onApply: PropTypes.func.isRequired,
};

UserAssignment.defaultProps = {
  users: null,
  onApply: () => {},
};

export default compose(
  firebaseConnect(() => [
    {
      path: '/users',
      storeAs: 'userList',
    },
  ]),
  connect(
    (
      { firebase: { data: { userList } } },
    ) => ({
      users: userList,
    }),
  ),
)(UserAssignment);
