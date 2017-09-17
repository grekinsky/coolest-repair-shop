import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './UserSelector.css';
import { UserList } from '../../models';

const cx = classNames.bind(styles);

class UserSelector extends Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  onClose(e) {
    e.preventDefault();
    this.props.onClose();
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
      <div className="Popup">
        <div className="Popup-bg" />
        <div
          className="Popup-modal"
          onClick={this.onClose}
          role="button"
          tabIndex={-1}
        >
          <div
            className="Popup-window"
            onClick={(e) => {
              e.stopPropagation();
            }}
            role="presentation"
          >
            <div className="Popup-controls">
              <a
                className="Popup-closeButton"
                href=""
                onClick={this.onClose}
              >
                X
              </a>
            </div>
            <div className={cx('UserSelector')}>
              <h3>Assign to user:</h3>
              <ul>
                {usersData}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

UserSelector.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  users: UserList,
  onSelected: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

UserSelector.defaultProps = {
  users: null,
  onSelected: () => {},
  onClose: () => {},
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
)(UserSelector);
