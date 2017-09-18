import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import qs from 'query-string';
import { push } from 'react-router-redux';
import { qsAdd, qsRemove } from '../../../util';
import styles from './Filters.css';

const cx = classNames.bind(styles);

const Filters = ({ routing, goTo }) => {
  const q = routing.location.search;
  // TODO: Remove hardcoded data from filters
  return (
    <div className={cx('Filters')}>
      <NavLink
        exact
        to={{ pathname: '/repairs', search: qsAdd(q, { status: 'complete' }) }}
        activeClassName="Filters-item--active"
        isActive={(match, currentLocation) =>
          match && qs.parse(currentLocation.search).status === 'complete'
        }
      > Complete </NavLink> |
      <NavLink
        exact
        to={{ pathname: '/repairs', search: qsAdd(q, { status: 'incomplete' }) }}
        activeClassName="Filters-item--active"
        isActive={(match, currentLocation) =>
          match && qs.parse(currentLocation.search).status === 'incomplete'
        }
      > Incomplete </NavLink> |
      <NavLink
        exact
        to={{ pathname: '/repairs', search: qsRemove(q, 'status') }}
        activeClassName="Filters-item--active"
        isActive={(match, currentLocation) =>
          match && !qs.parse(currentLocation.search).status
        }
      > All </NavLink>
      {'| User: '}
      <select
        onChange={
          (e) => {
            const selectedValue = e.target.options[e.target.selectedIndex].value;
            if (!selectedValue) {
              goTo({
                pathname: '/repairs',
                search: qsRemove(q, 'user'),
              });
            } else {
              goTo({
                pathname: '/repairs',
                search: qsAdd(q, { user: selectedValue }),
              });
            }
          }
        }
      >
        <option value="">All</option>
        <option value="A01vuc3HqDawXv6ly5nAmE6tkrz1">1</option>
        <option value="GA3ad5T7UoZn6G8qsKNc5caNZzS2">2</option>
      </select>
    </div>
  );
};

Filters.propTypes = {
  routing: PropTypes.object, // eslint-disable-line
  goTo: PropTypes.func.isRequired,
};

Filters.defaultProps = {
  authError: null,
  goTo: () => {},
};

const mapDispatchToProps = dispatch => ({
  goTo: (route) => {
    dispatch(push(route));
  },
});

export default connect(({ routing }) => ({
  routing,
}), mapDispatchToProps)(Filters);
