/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import { NavLink } from 'react-router-dom';
import { socialProviders } from '../../config/constants';
// import classNames from 'classnames/bind';
// import styles from './Login.css';

// const cx = classNames.bind(styles);

class Login extends Component {
  constructor(props) {
    super(props);
    this.socialProviderLogin = this.socialProviderLogin.bind(this);
    this.loginWithCredentials = this.loginWithCredentials.bind(this);
  }
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && auth.uid) {
      goTo('/');
    }
  }
  async loginWithCredentials({ email, password }) {
    try {
      await this.props.firebase.login({ email, password });
    } catch (e) {
      console.log('there was an error', e);
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
    const { auth } = this.props;

    if (!isLoaded(auth)) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div>
        <h1>Login page</h1>
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
              <dt />
              <dd><input type="submit" defaultValue="Sign in" /></dd>
            </dl>
          </fieldset>
        </form>
        <p>
          <NavLink exact to="/signup">{'Don\'t have an account yet?'}</NavLink>
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

Login.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func,
  }).isRequired,
  auth: PropTypes.shape({
    displayName: PropTypes.string,
  }).isRequired,
  authError: PropTypes.shape({
    message: PropTypes.string,
  }).isRequired,
  goTo: PropTypes.func,
};

Login.defaultProps = {
  authError: null,
  redirectToHome: () => {},
  goTo: () => {},
};

const mapDispatchToProps = dispatch => ({
  goTo: (route) => {
    dispatch(push(route));
  },
});

export default compose(
  firebaseConnect(),
  connect( // map redux state to props
    ({ firebase: { authError, auth } }) => ({
      authError,
      auth,
    }), mapDispatchToProps),
)(Login);