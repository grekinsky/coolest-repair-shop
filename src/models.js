import PropTypes from 'prop-types';

// Repair Model
export const Repair = PropTypes.shape({
  date: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  time: PropTypes.string,
  timestamp: PropTypes.string,
  uid: PropTypes.string,
});

// Repair Collection
export const RepairList = PropTypes.objectOf(Repair);

// Comment Model
export const Comment = PropTypes.shape({
  comment: PropTypes.string,
  timestamp: PropTypes.string,
  uid: PropTypes.string,
});

// Comment Collection
export const CommentList = PropTypes.objectOf(Comment);

// User Model
export const User = PropTypes.shape({
  displayName: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.string,
});

// User Colllection
export const UserList = PropTypes.objectOf(User);
