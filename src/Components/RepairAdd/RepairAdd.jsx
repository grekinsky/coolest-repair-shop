import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import repairActions from '../../actions/repairActions';
import commonActions from '../../actions/commonActions';
import styles from './RepairAdd.css';
import { userRole } from '../../Services/User';

const cx = classNames.bind(styles);

const RepairAdd = ({ comActions, actions, goTo }) => (
  <div className={cx('RepairAdd')}>
    <h1>Add Repair</h1>
    <form onSubmit={async (e) => {
      e.preventDefault();
      if (this.description.value) {
        try {
          await actions.add(this.description.value);
          goTo('/repairs');
        } catch (error) {
          comActions.setError(error.message);
        }
      }
    }}
    >
      <fieldset>
        <dl>
          <dt>Description</dt>
          <dd>
            <input
              type="text"
              ref={(el) => { this.description = el; }}
            />
          </dd>
        </dl>
        <input type="submit" defaultValue="Save" />
      </fieldset>
    </form>
  </div>
);

RepairAdd.propTypes = {
  actions: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  comActions: PropTypes.shape({
    setError: PropTypes.func,
  }).isRequired,
  goTo: PropTypes.func.isRequired,
};

RepairAdd.defaultProps = {
  mode: 'add',
  id: '',
};

const mapStateToProps = null;

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
  comActions: bindActionCreators(commonActions, dispatch),
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
)(RepairAdd);
