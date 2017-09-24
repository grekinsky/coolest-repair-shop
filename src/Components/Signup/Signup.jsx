import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import commonActions from '../../actions/commonActions';
import styles from './Signup.css';
import { userIsNotAuthenticated } from '../../Services/User';
import { ErrorModel } from '../../models';

const cx = classNames.bind(styles);

class Signup extends Component {
  constructor(props) {
    super(props);
    this.signUpWithCredentials = this.signUpWithCredentials.bind(this);
  }
  async signUpWithCredentials({ displayName, email, password, rePassword }) {
    const { comActions: { setError } } = this.props;
    if (!(displayName && email && password && rePassword)) {
      setError('All fields are required.');
      return false;
    }
    if (password !== rePassword) {
      setError('Passwords don\'t match');
      return false;
    }
    try {
      await this.props.firebase.createUser({
        email,
        password,
      });
      await this.props.firebase.updateProfile({ displayName });
    } catch (e) {
      setError(e.message);
      return false;
    }
    return true;
  }
  render() {
    const { error } = this.props;
    return (
      <div>
        <div className={cx('Login')}>
          <h1>Signup</h1>
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
              </dl>
              <input type="submit" defaultValue="Sign up" />
            </fieldset>
          </form>
          <p>
            <NavLink exact to="/login">{'I already have an account'}</NavLink>
          </p>
        </div>
        {error ? (
          <div className={cx('error-message')}>{error.detail}</div>
        ) : null}
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
  comActions: PropTypes.shape({
    setError: PropTypes.func,
  }).isRequired,
  error: ErrorModel,
};

Signup.defaultProps = {
  error: null,
};

const mapDispatchToProps = dispatch => ({
  comActions: bindActionCreators(commonActions, dispatch),
});

export default compose(
  userIsNotAuthenticated,
  firebaseConnect(),
  connect( // map redux state to props
    ({ error }) => ({
      error,
    }),
    mapDispatchToProps,
  ),
)(Signup);
