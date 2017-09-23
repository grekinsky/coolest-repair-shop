import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import repairActions from '../../../actions/repairActions';

class RepairActions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const {
      actions: {
        complete,
        incomplete,
        approve,
        reject,
      },
      id,
      status,
      showIfAdmin,
      assignTo,
    } = this.props;
    const btnAssignTo = (status === 'created')
      ? showIfAdmin(<li><button
        key={`assign_${id}`}
        onClick={() => {
          assignTo(id);
        }}
      >Assign</button></li>)
      : null;
    const btnComplete = (status === 'assigned'
      || status === 'working'
      || status === 'incomplete')
      ? (<li><button
        key={`complete_${id}`}
        onClick={() => {
          complete(id);
        }}
      >Complete</button></li>)
      : null;
    const btnIncomplete = (status === 'approved'
      || status === 'assigned'
      || status === 'rejected'
      || status === 'done'
      || status === 'incomplete')
      ? showIfAdmin(<li><button
        key={`incomplete_${id}`}
        onClick={() => {
          incomplete(id);
        }}
      >Incomplete</button></li>)
      : null;
    const btnApprove = (status === 'done'
      || status === 'rejected')
      ? showIfAdmin(<li><button
        key={`approve_${id}`}
        onClick={() => {
          approve(id);
        }}
      >Approve</button></li>)
      : null;
    const btnReject = (status === 'done'
      || status === 'approved')
      ? showIfAdmin(<li><button
        key={`reject_${id}`}
        onClick={() => {
          reject(id);
        }}
      >Reject</button></li>)
      : null;
    return (
      <ul>
        {btnAssignTo}
        {btnComplete}
        {btnIncomplete}
        {btnApprove}
        {btnReject}
      </ul>
    );
  }
}

RepairActions.propTypes = {
  id: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    assign: PropTypes.func,
    complete: PropTypes.func,
    approve: PropTypes.func,
    reject: PropTypes.func,
  }).isRequired,
  showIfAdmin: PropTypes.func.isRequired,
  assignTo: PropTypes.func,
};

RepairActions.defaultProps = {
  assignTo: () => {},
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(repairActions, dispatch),
});

export default compose(
  firebaseConnect(),
  connect(({ firebase: { profile: { role } } }) => (
    {
      showIfAdmin: c => (role === 'admin' ? c : null),
    }), mapDispatchToProps,
  ),
)(RepairActions);
