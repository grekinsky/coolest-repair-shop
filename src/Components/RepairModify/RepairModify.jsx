import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import repairActions from '../../actions/repairActions';
import styles from './RepairModify.css';
import { userRole } from '../../Services/User';

const cx = classNames.bind(styles);

const RepairModify = ({ isAdd, isUpdate, actions, goTo }) => (
  <div className={cx('RepairModify')}>
    <h1>
      {isAdd('Create Repair')}
      {isUpdate('Modify Repair')}
    </h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      if (this.description.value) {
        try {
          await actions.add(this.description.value);
          goTo('/repairs');
        } catch (error) {
          console.log(error); // eslint-disable-line
        }
      }
    }}
    >
      <fieldset>
        <dl>
          <dt>Description</dt>
          <dd><input type="text" ref={(el) => { this.description = el; }} /></dd>
        </dl>
        <input type="submit" defaultValue="Save changes" />
      </fieldset>
      <fieldset>
        <dl>
          <dt>Status:</dt>
          <dd><span className={cx('label')}>Assigned</span></dd>
        </dl>
        {isUpdate(
          <div>
            <dl>
              <dt>Assigned to:</dt>
              <dd><span className={cx('label')}>John Doe</span></dd>
              <dt>Assigned date:</dt>
              <dd><span className={cx('label')}>11/11/17 9:00AM</span></dd>
            </dl>
            <input type="button" defaultValue="Change Assignment" />
          </div>)}
      </fieldset>
    </form>
  </div>
);

RepairModify.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  mode: PropTypes.oneOf(['add', 'update']), // eslint-disable-line
  isAdd: PropTypes.func.isRequired,
  isUpdate: PropTypes.func.isRequired,
  goTo: PropTypes.func.isRequired,
};

RepairModify.defaultProps = {
  mode: 'add',
};

const mapStateToProps = (
  {
    firebase: {
      profile: { role },
    },
  },
  { mode },
) => ({
  role,
  isAdd: C => (mode === 'add' ? C : null),
  isUpdate: C => (mode === 'update' ? C : null),
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
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
)(RepairModify);
