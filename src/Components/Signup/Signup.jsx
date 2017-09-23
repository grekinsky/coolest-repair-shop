/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Signup.css';
import { socialProviders } from '../../config/constants';
import { userIsNotAuthenticated } from '../../Services/User';

const cx = classNames.bind(styles);

class Signup extends Component {
  constructor(props) {
    super(props);
    this.socialProviderLogin = this.socialProviderLogin.bind(this);
    this.signUpWithCredentials = this.signUpWithCredentials.bind(this);
  }
  async signUpWithCredentials({ displayName, email, password, rePassword }) {
    if (!(displayName && email && password && rePassword)) {
      debugger; // eslint-disable-line
      console.error('All fields are required.');
      return false;
    }
    if (password !== rePassword) {
      console.error('Passwords don\'t match');
      return false;
    }
    try {
      await this.props.firebase.createUser({
        email,
        password,
      });
      await this.props.firebase.updateProfile({ displayName });
    } catch (e) {
      console.error('there was an error', e);
      console.log('error prop:', this.props.authError); // thanks to connect
    }
    return true;
  }
  async socialProviderLogin(providerType) {
    // provider validation, should let add more providers later
    const provider = socialProviders
      .filter(item => item === providerType);
    if (!provider.length) return false;
    try {
      await this.props.firebase.login({ providerType });
    } catch (e) {
      console.log('there was an error', e);
      console.log('error prop:', this.props.authError); // thanks to connect
    }
    return true;
  }
  render() {
    return (
      <div className={cx('Signup')}>
        <h1>Signup page</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.signUpWithCredentials({
            displayName: this.displayName.value,
            email: this.email.value,
            password: this.password.value,
            rePassword: this.rePassword.value,
          });
        }}
        >
          <fieldset>
            <dl>
              <dt>Display name:</dt>
              <dd><input type="text" ref={(el) => { this.displayName = el; }} /></dd>
              <dt>E-mail:</dt>
              <dd><input type="text" ref={(el) => { this.email = el; }} /></dd>
              <dt>Password:</dt>
              <dd><input type="password" ref={(el) => { this.password = el; }} /></dd>
              <dt>Re-type password:</dt>
              <dd><input type="password" ref={(el) => { this.rePassword = el; }} /></dd>
              <dt />
              <dd><input type="submit" defaultValue="Sign in" /></dd>
            </dl>
          </fieldset>
        </form>
        <p>
          <NavLink exact to="/login">{'I already have an account'}</NavLink>
        </p>
        <p>Or choose your preferred method:</p>
        <ul>
          <li>
            <button onClick={() => { this.socialProviderLogin('google'); }}>
              Google Login
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

Signup.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func,
    createUser: PropTypes.func,
    updateProfile: PropTypes.func,
  }).isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string,
  }),
};

Signup.defaultProps = {
  authError: null,
};

export default compose(
  userIsNotAuthenticated,
  firebaseConnect(),
  connect( // map redux state to props
    ({ firebase: { authError } }) => ({
      authError,
    })),
)(Signup);
