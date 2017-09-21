import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import classNames from 'classnames/bind';
import styles from './AddComment.css';
import commentActions from '../../../../actions/commentActions';

const cx = classNames.bind(styles);

class AddComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayForm: false,
    };
  }
  render() {
    const { actions, auth, repairId } = this.props;
    if (this.state.displayForm) {
      return (
        <div className={cx('AddComment-form')}>
          <div>
            <textarea ref={(r) => {
              this.commentField = r;
            }}
            />
          </div>
          <div>
            <button
              className={cx('AddComment-send')}
              onClick={async () => {
                const comment = this.commentField.value;
                if (!comment) return;
                await actions.add(repairId, auth.uid, comment);
                this.setState({
                  displayForm: false,
                });
              }}
            >Send</button>
            <a
              href=""
              onClick={(e) => {
                e.preventDefault();
                this.setState({
                  displayForm: false,
                });
              }}
            >
              Cancel
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className={cx('AddComment-action')}>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            this.setState({
              displayForm: true,
            });
          }}
        >
          Add Comment
        </a>
      </div>
    );
  }
}

AddComment.propTypes = {
  auth: PropTypes.shape({
    uid: PropTypes.string,
  }).isRequired,
  actions: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  repairId: PropTypes.string.isRequired,
};

AddComment.defaultProps = {
  repairs: {},
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(commentActions, dispatch),
});

export default compose(
  connect(
    ({ firebase: { auth } }) => ({
      auth,
    }),
    mapDispatchToProps,
  ),
)(AddComment);
