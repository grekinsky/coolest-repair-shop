import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { compose } from 'redux';
import qs from 'query-string';
import { push } from 'react-router-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import moment from 'moment';
import Popup from '../../Shared/Popup';
import {
  qsAdd,
  qsRemove,
  setHoursToDate,
  extractHoursFromDate,
  dateFormat,
} from '../../../util';
import { UserList } from '../../../models';
import { DATE_FORMAT } from '../../../config/constants';
import TimeInput from '../../Shared/TimeInput';
import styles from './Filters.css';

const cx = classNames.bind(styles);

class Filters extends Component {
  constructor(props) {
    super(props);
    const { routing } = props;
    const q = qs.parse(routing.location.search);
    const from = q.dateFrom ? extractHoursFromDate(q.dateFrom) : extractHoursFromDate(moment());
    const to = q.dateTo ? extractHoursFromDate(q.dateTo) : extractHoursFromDate(moment());
    this.state = {
      filterByDateVisible: false,
      dateFrom: from.date,
      timeFrom: from.h,
      dateTo: to.date,
      timeTo: to.h,
    };
    this.hidePopup = this.hidePopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }
  hidePopup() {
    this.setState({
      filterByDateVisible: false,
    });
  }
  showPopup() {
    this.setState({
      filterByDateVisible: true,
    });
  }
  render() {
    const { routing, goTo, users } = this.props;
    const q = routing.location.search;
    // TODO: Remove hardcoded data from filters
    return (
      <div className={cx('Filters')}>
        <NavLink
          exact
          to={{ pathname: '/repairs', search: qsAdd(q, { status: 'complete' }) }}
          activeClassName="Filters-item--active"
          isActive={(match, currentLocation) =>
            match && qs.parse(currentLocation.search).status === 'complete'
          }
        > Complete </NavLink> |
        <NavLink
          exact
          to={{ pathname: '/repairs', search: qsAdd(q, { status: 'incomplete' }) }}
          activeClassName="Filters-item--active"
          isActive={(match, currentLocation) =>
            match && qs.parse(currentLocation.search).status === 'incomplete'
          }
        > Incomplete </NavLink> |
        <NavLink
          exact
          to={{ pathname: '/repairs', search: qsRemove(q, 'status') }}
          activeClassName="Filters-item--active"
          isActive={(match, currentLocation) =>
            match && !qs.parse(currentLocation.search).status
          }
        > All </NavLink>
        {'| User: '}
        <select
          onChange={
            (e) => {
              const selectedValue = e.target.value;
              if (!selectedValue) {
                goTo({
                  pathname: '/repairs',
                  search: qsRemove(q, 'user'),
                });
              } else {
                goTo({
                  pathname: '/repairs',
                  search: qsAdd(q, { user: selectedValue }),
                });
              }
            }
          }
        >
          <option value="">All</option>
          {!isEmpty(users) ? Object.keys(users).map(cKey => (
            <option key={cKey} value={cKey}>{users[cKey].displayName}</option>
          )) : ''}
        </select>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            this.showPopup();
          }}
        >
          Filter by date
        </a>
        {this.state.filterByDateVisible
          ? (
            <Popup onClose={this.hidePopup}>
              <div>
                From
                <DayPickerInput
                  value={dateFormat(this.state.dateFrom, DATE_FORMAT)}
                  placeholder={DATE_FORMAT}
                  onDayChange={(selectedDay) => {
                    this.setState({
                      dateFrom: selectedDay.valueOf().toString(),
                    });
                  }}
                />
                <TimeInput
                  value={this.state.timeFrom}
                  onChange={(selectedTime) => {
                    this.setState({
                      timeFrom: selectedTime,
                    });
                  }}
                />
              </div>
              <div>
                To
                <DayPickerInput
                  value={dateFormat(this.state.dateTo, DATE_FORMAT)}
                  placeholder={DATE_FORMAT}
                  onDayChange={(selectedDay) => {
                    this.setState({
                      dateTo: selectedDay.valueOf().toString(),
                    });
                  }}
                />
                <TimeInput
                  value={this.state.timeTo}
                  onChange={(selectedTime) => {
                    this.setState({
                      timeTo: selectedTime,
                    });
                  }}
                />
              </div>
              <hr />
              <div>
                <button
                  onClick={() => {
                    goTo({
                      pathname: '/repairs',
                      search: qsAdd(q, {
                        dateFrom: setHoursToDate(this.state.dateFrom, this.state.timeFrom),
                        dateTo: setHoursToDate(this.state.dateTo, this.state.timeTo),
                      }),
                    });
                    this.hidePopup();
                  }}
                >Apply</button>
                <button
                  onClick={() => {
                    goTo({
                      pathname: '/repairs',
                      search: qsRemove(q, [
                        'dateFrom',
                        'dateTo',
                      ]),
                    });
                    this.hidePopup();
                  }}
                >Clear</button>
              </div>
            </Popup>
          ) : ''
        }
      </div>
    );
  }
}


Filters.propTypes = {
  users: UserList,
  routing: PropTypes.object, // eslint-disable-line
  goTo: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  authError: null,
  users: null,
  goTo: () => {},
};

const mapDispatchToProps = dispatch => ({
  goTo: (route) => {
    dispatch(push(route));
  },
});

export default compose(
  firebaseConnect(() => [
    {
      path: '/users',
      storeAs: 'userList',
    },
  ]),
  connect(
    (
      { firebase: { data: { userList } }, routing },
    ) => ({
      users: userList,
      routing,
    }),
    mapDispatchToProps,
  ),
)(Filters);
