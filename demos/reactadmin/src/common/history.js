let createHistory;

if (process.env.NODE_ENV === 'production') {
  createHistory = require('history/createHashHistory').default;
} else {
  createHistory = require('history/createBrowserHistory').default;
}

const history = createHistory();
export default history;
