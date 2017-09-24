import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import { User } from '../../models';
import userActions from '../../actions/userActions';
import styles from './UserModify.css';
import { userRole } from '../../Services/User';

const cx = classNames.bind(styles);

class UserModify extends Component {
  render() {
    const { id, actions, goTo, user } = this.props;
    return (
      <div className={cx('UserModify')}>
        <h1>Modify User</h1>
        {!isEmpty(user) ? (
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await actions.modify(
                id,
                this.displayName.value,
                this.role.value,
              );
              goTo('/users');
            } catch (error) {
              console.log(error); // eslint-disable-line
            }
          }}
          >
            <fieldset>
              <dl>
                <dt>Name</dt>
                <dd>
                  <input
                    type="text"
                    ref={(el) => { this.displayName = el; }}
                    defaultValue={user.displayName || ''}
                  />
                </dd>
                <dt>Role</dt>
                <dd>
                  <select
                    ref={(el) => { this.role = el; }}
                    defaultValue={user.role || user}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </dd>
              </dl>
              <input type="submit" defaultValue="Save Changes" />
            </fieldset>
          </form>
        ) : null}
      </div>
    );
  }
}

UserModify.propTypes = {
  actions: PropTypes.shape({
    modify: PropTypes.func,
  }).isRequired,
  user: User,
  id: PropTypes.string,
  goTo: PropTypes.func.isRequired,
};

UserModify.defaultProps = {
  id: '',
  user: null,
};

const fbStoreKey = ({ id }) => [
  {
    path: `/users/${id}`,
    storeAs: 'userDetail',
  },
];

const mapStateToProps = (
  { firebase: {
    data: { userDetail },
  } },
) => ({
  user: userDetail,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch),
  goTo: (path) => {
    dispatch(push(path));
  },
});

export default compose(
  userRole('admin'),
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserModify);
