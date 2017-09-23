import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import { User } from '../../../models';
import { extractHoursFromDate, dateFormat, timeFormat } from '../../../util';
import { DATE_FORMAT } from '../../../config/constants';
import RepairActions from '../RepairActions';

const RepairRow = ({ repair, showIfAdmin, assignTo }) => {
  const d = !isEmpty(repair.user) ? extractHoursFromDate(repair.date) : null;
  return (
    <tr key={repair.id}>
      <td>
        <NavLink exact to={`/repairs/${repair.id}`}>
          {repair.description}
        </NavLink>
      </td>
      <td>{repair.status}</td>
      {showIfAdmin(<td>
        {!isEmpty(repair.user)
          ? repair.user.displayName
          : '(not assigned)'}
      </td>)}
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
          <RepairActions id={repair.id} status={repair.status} assignTo={assignTo} />
        </div>
      </td>
    </tr>
  );
};

RepairRow.propTypes = {
  repair: PropTypes.shape({
    id: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.string,
    timestamp: PropTypes.number,
    user: User,
    date: PropTypes.number,
  }).isRequired,
  showIfAdmin: PropTypes.func.isRequired,
  assignTo: PropTypes.func,
};

RepairRow.defaultProps = {
  assignTo: () => {},
};

export default compose(
  firebaseConnect(),
  connect(({ firebase: { profile: { role } } }) => (
    {
      showIfAdmin: c => (role === 'admin' ? c : null),
    }),
  ),
)(RepairRow);
