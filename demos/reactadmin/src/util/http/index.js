if (process.env.NODE_ENV === 'real') {
  module.exports = require('./axiosInstance').default;
} else {
  module.exports = require('./mock/index').default;
}
