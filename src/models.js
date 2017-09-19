import PropTypes from 'prop-types';

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

// Repair Model
export const Repair = PropTypes.shape({
  date: PropTypes.string,
  description: PropTypes.string,
  status: PropTypes.string,
  timestamp: PropTypes.string,
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
  timestamp: PropTypes.string,
  uid: PropTypes.string,
});

// Comment Collection
export const CommentList = PropTypes.objectOf(Comment);
