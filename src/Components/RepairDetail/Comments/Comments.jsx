import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { firebaseConnect, populate } from 'react-redux-firebase';
import ReactTimeAgo from 'react-time-ago';
import classNames from 'classnames/bind';
import styles from './Comments.css';
import AddComment from './AddComment';
import { CommentList } from '../../../models';

const cx = classNames.bind(styles);

const Comments = ({ comments, repairId }) => {
  const commentsData = comments ? Object.keys(comments).map((cKey) => {
    const c = comments[cKey];
    return (
      <li key={cKey} className={cx('Comment')}>
        <span className={cx('Comment-date')}>
          {c.timestamp ? <ReactTimeAgo locale="en">{new Date(c.timestamp)}</ReactTimeAgo> : '-'}
        </span>
        <div className={cx('Comment-user')}>
          {c.user.displayName}
        </div>
        <div className={cx('Comment-message')}>
          {c.comment}
        </div>
      </li>
    );
  }) : '';
  return (
    <div className={cx('Comments')}>
      <h3>Comments</h3>
      <ul className={cx('Comments-list')}>
        {commentsData}
      </ul>
      <AddComment repairId={repairId} />
    </div>
  );
};

Comments.propTypes = {
  comments: CommentList,
  repairId: PropTypes.string.isRequired,
};

Comments.defaultProps = {
  comments: null,
};

const populates = [
  { child: 'user', root: 'users' },
];

export default compose(
  firebaseConnect(({ repairId }) => [
    {
      path: `/comments/${repairId}`,
      storeAs: 'repairComments',
      populates,
    },
  ]),
  connect(
    (
      { firebase },
    ) => ({
      comments: populate(firebase, 'repairComments', populates),
    })),
)(Comments);
