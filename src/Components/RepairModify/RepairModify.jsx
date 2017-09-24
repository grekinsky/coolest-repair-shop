import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect, isEmpty } from 'react-redux-firebase';
import { push } from 'react-router-redux';
import classNames from 'classnames/bind';
import repairActions from '../../actions/repairActions';
import commonActions from '../../actions/commonActions';
import styles from './RepairModify.css';
import { userRole } from '../../Services/User';
import { FlatRepair } from '../../models';
import { flattenRepair } from '../../Services/Filters';
import { dateTimeFormat } from '../../util';
import RepairActions from '../Shared/RepairActions';
import Popup from '../Shared/Popup';
import UserAssignment from '../Shared/UserAssignment';

const cx = classNames.bind(styles);

class RepairModify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      assignTo: '',
    };
    this.onSelectedForAssign = this.onSelectedForAssign.bind(this);
    this.hidePopup = this.hidePopup.bind(this);
    this.showPopup = this.showPopup.bind(this);
  }
  async onSelectedForAssign(userId, date) {
    const { actions: { assign }, comActions: { setError } } = this.props;
    const { assignTo } = this.state;
    try {
      await assign(assignTo, userId, date);
    } catch (e) {
      setError(e.message);
    } finally {
      this.hidePopup();
    }
  }
  showPopup(id) {
    this.setState({
      assignTo: id,
    });
  }
  hidePopup() {
    this.setState({
      assignTo: '',
    });
  }
  render() {
    const { id, comActions: { setError }, actions, goTo, repair } = this.props;
    return (
      !isEmpty(repair) ? (
        <div className={cx('RepairModify')}>
          <h1>Modify Repair</h1>
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (this.description.value) {
              try {
                await actions.modify(id, this.description.value);
                goTo(`/repairs/${id}`);
              } catch (error) {
                setError(error.message);
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
                    defaultValue={repair.description}
                  />
                </dd>
              </dl>
              <input type="submit" defaultValue="Save changes" />
            </fieldset>
            <fieldset>
              <dl>
                <dt>Status:</dt>
                <dd><span className={cx('label')}>{repair.status}</span></dd>
              </dl>
              {repair.user ? (
                <dl>
                  <dt>Assigned to:</dt>
                  <dd><span className={cx('label')}>{repair.user.displayName}</span></dd>
                  <dt>Assigned date:</dt>
                  <dd><span className={cx('label')}>{dateTimeFormat(repair.date)}</span></dd>
                </dl>
              ) : null}
              <RepairActions id={repair.id} status={repair.status} assignTo={this.showPopup} />
            </fieldset>
          </form>
          {this.state.assignTo
            ? (
              <Popup onClose={this.hidePopup} wide={false}>
                <UserAssignment
                  onApply={this.onSelectedForAssign}
                />
              </Popup>
            ) : ''
          }
        </div>
      ) : null
    );
  }
}
RepairModify.propTypes = {
  actions: PropTypes.shape({
    modify: PropTypes.func,
  }).isRequired,
  comActions: PropTypes.shape({
    setError: PropTypes.func,
  }).isRequired,
  repair: FlatRepair,
  id: PropTypes.string,
  goTo: PropTypes.func.isRequired,
};

RepairModify.defaultProps = {
  id: '',
  repair: null,
};

const fbStoreKey = ({ id }) => [
  {
    path: `/repairs/${id}`,
    storeAs: 'repairDetail',
  },
  {
    path: '/users',
    storeAs: 'userList',
  },
  {
    path: '/assignments',
    storeAs: 'assignmentList',
  },
];

const mapStateToProps = (
  { firebase: {
    profile: {
      role,
    },
    data: {
      repairDetail,
      userList,
      assignmentList,
    },
  } },
  { id },
) => ({
  role,
  repair: flattenRepair(
    repairDetail,
    id,
    userList,
    assignmentList,
  ),
  repairUser: repairDetail ? repairDetail.user : '',
  assignments: assignmentList,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
  comActions: bindActionCreators(commonActions, dispatch),
  goTo: (path) => {
    dispatch(push(path));
  },
});

export default compose(
  userRole('admin'),
  firebaseConnect(fbStoreKey),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(RepairModify);
