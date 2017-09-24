import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import userActions from '../../../actions/userActions';
import styles from './UserActions.css';

const cx = classNames.bind(styles);

const UserActions = (
  {
    id,
    actions: {
      remove,
    },
    goTo,
  },
) => {
  const btnDelete = (
    <li><button
      className="btnDanger"
      key={`remove_${id}`}
      onClick={(e) => {
        e.preventDefault();
        remove(id);
      }}
    >Delete</button></li>);
  const btnModify = (
    <li><button
      key={`modify_${id}`}
      onClick={(e) => {
        e.preventDefault();
        goTo(`/users/${id}/edit`);
      }}
    >Modify</button></li>);
  return (
    <ul className={cx('UserActions')}>
      {btnModify}
      {btnDelete}
    </ul>
  );
};

UserActions.propTypes = {
  id: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    remove: PropTypes.func,
  }).isRequired,
  goTo: PropTypes.func.isRequired,
};

const mapStateToProps = null;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(userActions, dispatch),
  goTo: (path) => {
    dispatch(push(path));
  },
});

export default compose(
  firebaseConnect(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(UserActions);
