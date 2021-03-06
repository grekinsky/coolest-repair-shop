export const ENV = window.env || 'development';

// Error Types
export const ERROR_GENERAL = 0;
export const errorTypes = [
  ERROR_GENERAL,
];

// Firebase config
const fbConfigProduction = {
  apiKey: 'AIzaSyCIlmp4g_8N7cJaZEOoFh4u15TTUE2zVFg',
  authDomain: 'toptal-react-academy.firebaseapp.com',
  databaseURL: 'https://toptal-react-academy.firebaseio.com',
  projectId: 'toptal-react-academy',
};
/*
const fbConfigDevelopment = {
  apiKey: 'AIzaSyArYwTEoR1giF3vwl8skL8Gj3NMrPbvT88',
  authDomain: 'toptal-react-academy-dev.firebaseapp.com',
  databaseURL: 'https://toptal-react-academy-dev.firebaseio.com',
  projectId: 'toptal-react-academy-dev',
};
*/
const fbConfig = {
  development: fbConfigProduction,
  production: fbConfigProduction,
};

export const getFbConfig = env => fbConfig[env] || fbConfig.development;

export const timeList = [
  '12:00 AM', '1:00 AM', '2:00 AM', '3:00 AM', '4:00 AM', '5:00 AM', '6:00 AM',
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM',
  '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM',
  '9:00 PM', '10:00 PM', '11:00 PM',
];

export const DATE_FORMAT = 'MM/DD/YYYY';
