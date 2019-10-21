if (process.env.NODE_ENV === 'development') {
  module.exports = require('./mock').default
} else {
  module.exports = require('../utils/http').default
}
