import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import styles from './Login.css';
import { userIsNotAuthenticated } from '../../Services/User';

const cx = classNames.bind(styles);

class Login extends Component {
  constructor(props) {
    super(props);
    this.loginWithCredentials = this.loginWithCredentials.bind(this);
  }
  async loginWithCredentials({ email, password }) {
    try {
      await this.props.firebase.login({ email, password });
    } catch (e) {
      console.log('there was an error', e); // eslint-disable-line
      console.log('error prop:', this.props.authError); // eslint-disable-line
    }
    return true;
  }
  render() {
    return (
      <div className={cx('Login')}>
        <h1>Login</h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          this.loginWithCredentials({
            email: this.email.value,
            password: this.password.value,
          });
        }}
        >
          <fieldset>
            <dl>
              <dt>E-mail:</dt>
              <dd><input type="text" ref={(el) => { this.email = el; }} /></dd>
              <dt>Password:</dt>
              <dd><input type="password" ref={(el) => { this.password = el; }} /></dd>
            </dl>
            <input type="submit" defaultValue="Log in" />
          </fieldset>
        </form>
        <p>
          <NavLink exact to="/signup">{'Don\'t have an account yet?'}</NavLink>
        </p>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func,
  }).isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
};

Login.defaultProps = {
  authError: null,
};

export default compose(
  userIsNotAuthenticated,
  firebaseConnect(),
  connect( // map redux state to props
    ({ firebase: { authError } }) => ({
      authError,
    })),
)(Login);
