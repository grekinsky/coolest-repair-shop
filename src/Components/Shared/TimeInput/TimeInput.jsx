import React from 'react';
import PropTypes from 'prop-types';
import { timeList } from '../../../config/constants';

const TimeInput = ({ onChange, value }) => (
  <select
    value={value}
    onChange={
      (e) => {
        const selectedValue = e.target.value;
        onChange(selectedValue);
      }
    }
  >
    {timeList.map((t, i) =>
      <option key={t} value={i}>{t}</option> // eslint-disable-line
    )}
  </select>
);

TimeInput.propTypes = {
  onChange: PropTypes.func,
  value: PropTypes.string,
};

TimeInput.defaultProps = {
  onChange: () => {},
  value: '',
};

export default TimeInput;
