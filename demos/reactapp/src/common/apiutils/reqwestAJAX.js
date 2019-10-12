import reqwest from 'reqwest'
import _ from 'lodash'
import {
  defaultBiJsonOptions,
  defaultJsonOptions,
  defaultOptions,
  getRealUrl,
  METHODS,
  REQ_TYPE,
  wrapErrorHandler
} from './ajaxCommon'

function _doFetch(options = {}, dispatch, defaultMergeOption = {}) {
  const opts = _.merge({}, defaultMergeOption, options, {
    url: getRealUrl(options.url),
    error: wrapErrorHandler(options.onError, dispatch)
  })

  const method = opts.method && opts.method.toUpperCase()
  const data = opts.data
  if (METHODS.GET === method && opts.processData !== false && !_.isString(data)) {
    // get 请求，配置 processData 不为否，data 不为 String 则预处理
    const newData = { ...data, ts: new Date().getTime() } // 加入时间戳，防止浏览器缓存
    opts.data = reqwest.toQueryString(newData, true) // traditional 方式，保证数组符合 spring mvc 的传参方式。
  }

  opts.success = (res) => {
    const doSuc = options.onSuccess ? options.onSuccess : defaultOptions.onSuccess // reqwest 名字不同
    if (opts.type === REQ_TYPE.JSON || typeof res === 'object') {
      // noinspection JSUnresolvedVariable
      if (res.result === 0 || res.ret === 0) {
        doSuc(res.data)
      } else {
        opts.error(res)
      }
    } else {
      doSuc(res)
    }
  }

  reqwest(opts)
}

export function doFetch(options = {}, dispatch) {
  _doFetch(options, dispatch, defaultOptions)
}

export function doFetchJson(options = {}, dispatch) {
  _doFetch(options, dispatch, defaultJsonOptions)
}

export function doBiJsonFetch(options = {}, dispatch) {
  let opts = options
  if (typeof opts.data === 'object') {
    opts = { ...options, data: JSON.stringify(opts.data) }
  }
  _doFetch(opts, dispatch, defaultBiJsonOptions)
}
