/* eslint-disable no-console */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
// import classNames from 'classnames/bind';
// import styles from './Login.css';

// const cx = classNames.bind(styles);

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    this.googleLogin = this.googleLogin.bind(this);
    this.logout = this.logout.bind(this);
  }
  googleLogin() {
    this.setState({ isLoading: true });
    return this.props.firebase
      .login({ provider: 'google' })
      .then(() => {
        this.setState({ isLoading: false });
        // this is where you can redirect to another route
      })
      .catch((error) => {
        this.setState({ isLoading: false });
        console.log('there was an error', error);
        console.log('error prop:', this.props.authError); // thanks to connect
      });
  }
  logout() {
    this.props.firebase.logout();
  }
  render() {
    // const { authError } = this.props;
    const { auth } = this.props;

    if (!isLoaded(auth)) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    }

    if (isEmpty(auth)) {
      return (
        <div>
          <p>Login page</p>
          <button onClick={this.googleLogin}>Google Login</button>
        </div>
      );
    }

    console.log(auth);

    return (
      <div>
        <p>{`Welcome ${auth.displayName}!`}</p>
        <button onClick={this.logout}>Log out</button>
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }).isRequired,
  auth: PropTypes.object, // eslint-disable-line
  authError: PropTypes.any, // eslint-disable-line
};

Login.defaultProps = {
  authError: '',
};

export default compose(
  firebaseConnect(),
  connect( // map redux state to props
    ({ firebase: { authError, auth } }) => ({
      authError,
      auth,
    })),
)(Login);
