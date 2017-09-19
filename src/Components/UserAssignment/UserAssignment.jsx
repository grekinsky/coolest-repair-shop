import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './UserAssignment.css';
import { UserList } from '../../models';

const cx = classNames.bind(styles);

class UserAssignment extends Component {
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  render() {
    const { users, onSelected } = this.props;
    const usersData = !isEmpty(users) ? Object.keys(users).map(cKey => (
      <li key={cKey}>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            onSelected(cKey);
          }}
        >
          {users[cKey].displayName}
        </a>
      </li>
    )) : '';
    return (
      <div className={cx('UserAssignment')}>
        <h3>Assign to user:</h3>
        <ul>
          {usersData}
        </ul>
      </div>
    );
  }
}

UserAssignment.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  users: UserList,
  onSelected: PropTypes.func.isRequired,
};

UserAssignment.defaultProps = {
  users: null,
  onSelected: () => {},
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
      { firebase: { data: { userList }, auth } },
    ) => ({
      users: userList,
      auth,
    }),
  ),
)(UserAssignment);
