import PropTypes from 'prop-types';
import { errorTypes } from './config/constants';

// User Model
export const User = PropTypes.shape({
  avatarUrl: PropTypes.string,
  displayName: PropTypes.string,
  email: PropTypes.string,
  providerData: PropTypes.array,
  role: PropTypes.string,
});

// User Colllection
export const UserList = PropTypes.objectOf(User);

// FlatRepair Model
export const FlatRepair = PropTypes.shape({
  id: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  timestamp: PropTypes.number,
  user: PropTypes.oneOfType([
    User,
    PropTypes.string,
  ]),
  date: PropTypes.number,
});

// FlatRepair Collection
export const FlatRepairList = PropTypes.arrayOf(FlatRepair);

// Repair Model
export const Repair = PropTypes.shape({
  description: PropTypes.string,
  status: PropTypes.string,
  timestamp: PropTypes.number,
  user: PropTypes.oneOfType([
    User,
    PropTypes.string,
  ]),
});

// Repair Collection
export const RepairList = PropTypes.objectOf(Repair);

// Comment Model
export const Comment = PropTypes.shape({
  comment: PropTypes.string,
  timestamp: PropTypes.number,
  user: PropTypes.oneOfType([
    User,
    PropTypes.string,
  ]),
});

// Comment Collection
export const CommentList = PropTypes.objectOf(Comment);

// Assignment Model
export const Assignment = PropTypes.objectOf( // repairId
  PropTypes.shape({ // assignment
    date: PropTypes.number,
  }),
);

// Assignment Collection
export const AssignmentList = PropTypes.objectOf(Assignment);

export const ErrorModel = PropTypes.shape({
  type: PropTypes.oneOf(errorTypes),
  detail: PropTypes.string,
});
