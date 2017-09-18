import qs from 'query-string';

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
