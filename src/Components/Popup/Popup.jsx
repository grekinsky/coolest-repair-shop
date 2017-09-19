import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Popup.css';

const cx = classNames.bind(styles);

const Popup = ({
  children,
  onClose,
  wide,
}) => {
  const onClosePopup = (e) => {
    e.preventDefault();
    onClose();
  };
  return (
    <div className={cx('Popup')}>
      <div className={cx('Popup-bg')} />
      <div
        className={cx('Popup-modal')}
        onClick={onClosePopup}
        role="button"
        tabIndex={-1}
      >
        <div
          className={cx({
            'Popup-window': true,
            'Popup-window--wide': wide,
          })}
          onClick={(e) => {
            e.stopPropagation();
          }}
          role="presentation"
        >
          <div className={cx('Popup-controls')}>
            <a
              className={cx('Popup-closeButton')}
              href=""
              onClick={onClosePopup}
            >
              X
            </a>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

Popup.propTypes = {
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  wide: PropTypes.bool,
};

Popup.defaultProps = {
  onClose: () => {},
  wide: true,
};

export default Popup;
