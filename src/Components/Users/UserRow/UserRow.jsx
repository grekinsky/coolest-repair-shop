import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { User } from '../../../models';
import UserActions from '../../Shared/UserActions';

const UserRow = ({ id, user }) => (
  <tr>
    <td>
      <NavLink exact to={`/users/${id}`}>
        {user.displayName}
      </NavLink>
    </td>
    <td>{user.email}</td>
    <td>{user.role}</td>
    <td>
      <UserActions id={id} />
    </td>
  </tr>
);

UserRow.propTypes = {
  id: PropTypes.string.isRequired,
  user: User.isRequired,
};

export default UserRow;
