import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect } from 'react-redux-firebase';
import classNames from 'classnames/bind';
import styles from './RepairDetail.css';
import { Repair, CommentList } from '../../models';

const cx = classNames.bind(styles);

class RepairDetail extends Component {
  componentWillReceiveProps({ auth, goTo }) {
    if (auth && !auth.uid) {
      goTo('/login');
    }
  }
  render() {
    const { repair, comments } = this.props;
    const repairData = repair ? Object.keys(repair).map(rKey => (
      <dl key={rKey}>
        <dt>{rKey}</dt>
        <dd>{repair[rKey]}</dd>
      </dl>
    )) : '';
    const commentsData = comments ? Object.keys(comments).map(cKey => (
      <li key={cKey}>{comments[cKey].comment}</li>
    )) : '';
    return (
      <div className={cx('RepairDetail')}>
        <h2>Repair Detail</h2>
        {repairData}
        <ul>
          {commentsData}
        </ul>
      </div>
    );
  }
}

RepairDetail.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  repair: Repair,
  comments: CommentList,
};

RepairDetail.defaultProps = {
  repair: null,
  comments: null,
};

export default compose(
  firebaseConnect(({ match: { params: { id } } }) => [
    {
      path: `/repairs/${id}`,
      storeAs: 'repairDetail',
    },
    {
      path: `/comments/${id}`,
      storeAs: 'repairComments',
    },
  ]),
  connect(
    (
      { firebase: { data: { repairDetail, repairComments }, auth } },
    ) => ({
      repair: repairDetail,
      comments: repairComments,
      auth,
    })),
)(RepairDetail);
