import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { NavLink } from 'react-router-dom';
import classNames from 'classnames/bind';
import commonActions from '../../actions/commonActions';
import styles from './Login.css';
import { userIsNotAuthenticated } from '../../Services/User';
import { ErrorModel } from '../../models';

const cx = classNames.bind(styles);

class Login extends Component {
  constructor(props) {
    super(props);
    this.loginWithCredentials = this.loginWithCredentials.bind(this);
  }
  async loginWithCredentials({ email, password }) {
    const { comActions: { setError } } = this.props;
    try {
      await this.props.firebase.login({ email, password });
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
        {error ? (
          <div className={cx('error-message')}>{error.detail}</div>
        ) : null}
      </div>
    );
  }
}

Login.propTypes = {
  firebase: PropTypes.shape({
    login: PropTypes.func,
  }).isRequired,
  comActions: PropTypes.shape({
    setError: PropTypes.func,
  }).isRequired,
  error: ErrorModel,
};

Login.defaultProps = {
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
)(Login);
