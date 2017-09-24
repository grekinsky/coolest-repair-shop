import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import userActions from '../../actions/userActions';
import styles from './UserAdd.css';
import { userRole } from '../../Services/User';

const cx = classNames.bind(styles);

const UserAdd = ({ actions, goTo }) => (
  <div className={cx('UserAdd')}>
    <h1>Add User</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      try {
        await actions.add(
          this.displayName.value,
          this.email.value,
          this.password.value,
          this.rePassword.value,
          'user',
          false, // TODO: This should prevent Automatic sign in but it doesn't work
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
            />
          </dd>
          <dt>E-mail</dt>
          <dd>
            <input
              type="text"
              ref={(el) => { this.email = el; }}
            />
          </dd>
          <dt>Password</dt>
          <dd>
            <input
              type="password"
              ref={(el) => { this.password = el; }}
            />
          </dd>
          <dt>Re-type password</dt>
          <dd>
            <input
              type="password"
              ref={(el) => { this.rePassword = el; }}
            />
          </dd>
        </dl>
        <input type="submit" defaultValue="Save" />
      </fieldset>
    </form>
  </div>
);

UserAdd.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  goTo: PropTypes.func.isRequired,
};

UserAdd.defaultProps = {
  id: '',
};

const mapStateToProps = null;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch),
  goTo: (path) => {
    dispatch(push(path));
  },
});

const fbStoreKey = () => [];

export default compose(
  userRole('admin'),
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserAdd);
