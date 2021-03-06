import qs from 'query-string';
import moment from 'moment';
import { timeList, DATE_FORMAT } from './config/constants';

export const qsAdd = (q, val) => {
  if (!val) return '';
  const query = q ? qs.parse(q) : {};
  return qs.stringify(Object.assign(query, val));
};

export const qsRemove = (q, val) => {
  if (!val) return '';
  const query = q ? qs.parse(q) : {};
  if (val instanceof Array) {
    let i = 0;
    while (i <= val.length) {
      delete query[val[i]];
      i += 1;
    }
  } else {
    delete query[val];
  }
  return qs.stringify(query);
};

const parseDate = (date) => {
  const d = typeof date === 'number' ? date : parseInt(date, 10);
  return moment.isMoment(d) ? d.clone() : moment(d);
};

export const dateFormat = (date, f) => {
  const d = parseDate(date);
  return d.format(f);
};

export const timeFormat = h => timeList[parseInt(h, 10)];

export const setHoursToDate = (date, h) => {
  const d = parseDate(date);
  d.startOf('day');
  d.add(parseInt(h, 10), 'hour');
  return d.valueOf();
};

export const extractHoursFromDate = (date) => {
  const d = parseDate(date);
  const flat = d.clone();
  flat.startOf('day');
  return {
    date: flat.valueOf(),
    h: d.format('H'),
  };
};

export const dateTimeFormat = (date) => {
  const d = extractHoursFromDate(date);
  const formatedDate = dateFormat(d.date, DATE_FORMAT);
  const formatedTime = timeFormat(d.h);
  return `${formatedDate} ${formatedTime}`;
};

export const stringSample = (length) => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
