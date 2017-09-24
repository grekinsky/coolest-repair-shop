import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import styles from './Users.css';
import { UserList } from '../../models';
import UserRow from './UserRow';

const cx = classNames.bind(styles);

const Users = ({ users, goTo }) => (
  <div className={cx('Users')}>
    <h1>Users</h1>
    <button
      className={cx('Users-addButton')}
      onClick={() => {
        goTo('/users/add');
      }}
    >Add User</button>
    <table className={cx('Repairs-table')}>
      <thead>
        <tr>
          <th>Name</th>
          <th>E-mail</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(users).map((key) => {
          const user = users[key];
          return <UserRow key={key} id={key} user={user} />;
        })}
      </tbody>
    </table>
  </div>
);

Users.propTypes = {
  users: UserList,
  goTo: PropTypes.func.isRequired,
};

Users.defaultProps = {
  users: {},
};

const fbStoreKey = () => [
  {
    path: '/users',
    storeAs: 'userList',
  },
];

const mapStateToProps = (
  {
    firebase: {
      data: { userList },
    },
  },
) => ({
  users: userList,
});

const mapDispatchToProps = dispatch => ({
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
)(Users);
