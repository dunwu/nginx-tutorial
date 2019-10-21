import { Modal } from 'antd'
import _ from 'lodash'

import { COMMON_REQUEST_ERROR } from '../../redux/constants/commonActionTypes'

export const REQ_BASE_URL = '/api'

export const METHODS = {
  GET: 'GET',
  HEAD: 'HEAD',
  POST: 'POST',
  PUT: 'PUT',
  DEL: 'DEL',
  OPTIONS: 'OPTIONS',
  PATCH: 'PATCH'
}

export const REQ_TYPE = {
  HTML: 'html',
  JSON: 'json',
  JSONP: 'jsonp'
}

export const CACHE_TYPE = {
  DEFAULT: 'default',
  NO_STORE: 'no-store',
  RELOAD: 'reload',
  NO_CACHE: 'no-cache',
  FORCE_CACHE: 'force-cache'
}

export const ERROR_HANDLER_TYPE = {
  NO: 'NO', // ['NO' | undefined | false ] 不处理
  SYSTEM: 'SYSTEM', // ['SYSTEM'] 只处理系统预料外的返回（not json）
  SYSTEM_AND_AUTH: 'SYSTEM_AND_AUTH', // [true, 'SYSTEM_AND_AUTH'] 处理上一步，与 认证失败 （比较常用，所以单独列出，用true）
  ALL: 'ALL' //  [no errorHandler | 'ALL'] 所有
}

export const defaultOptions = {
  url: null,
  method: METHODS.GET,
  headers: {},
  data: null,
  type: null,
  contentType: null,
  crossOrigin: null,
  onSuccess: () => {
  },
  onError: () => {
  },
  cache: CACHE_TYPE.NO_CACHE
}

// 在 defaultOptions 基础上多出来的, request plan text，response json
export const defaultJsonOptions = _.merge({}, defaultOptions, {
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Cache-Control': 'no-cache'
  },
  type: REQ_TYPE.JSON
})

// 在 defaultJsonOptions 基础上多出来的, request response 皆是 json
export const defaultBiJsonOptions = _.merge({}, defaultJsonOptions, {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  reqType: REQ_TYPE.JSON
})

// 获取真正请求的 URL
export function getRealUrl(url) {
  if (!!url && !url.startsWith('http')) {
    return REQ_BASE_URL + url
  }
  return url
}

/**
 * 展示认证错误
 * @private
 */
function _showAuthError() {
  Modal.error({
    title: '认证失败',
    // eslint-disable-next-line react/jsx-filename-extension
    content: ( < p > 您现在处于非认证状态！！！<
  br / >
  如果想保留本页状态，请在 < a
  href = '/login'
  target = 'blank' > 新页面登陆 < /a> 。<br / >
    { /* 否则在 <Link to="/login" >当前页登陆</Link> 。 */ }
    < /p>),
})

}

/**
 * 防抖展示认证错误（一段时间内仅一次）
 * @type {Function}
 */
const showAuthError = _.debounce(_showAuthError, 500, {
  leading: true,
  trailing: false
})

/**
 * 展示服务端错误信息
 * @param e
 */
function _showServerError(e) {
  Modal.error({
    title: '服务端错误！',
    content: `服务端错误。服务端可能未正确部署或由于其他原因响应失败！请保留现场并联系开发人员。错误信息： ${e}`
  })
}

/**
 * 防抖展示服务端错误（一段时间内仅一次）
 * @type {Function}
 */
const showServerError = _.debounce(_showServerError, 500, {
  leading: true,
  trailing: false
})

/**
 * 包装错误处理。所有服务端应用（非业务）非 ret 预计错误与认证错误统一处理。
 * 其他根据情况，如果未传入错误处理函数或错误处理函数返回 true，则接管处理。
 * 用于处理 api 请求未传入错误处理函数的情况。<br />
 * 如果传入 dispatch，则会 dispatch 公共 action。<br />
 * 如果无 dispatch，则 console.log error
 * @param errorHandler
 * @param dispatch
 * @returns {function()}
 */
export function wrapErrorHandler(errorHandler, dispatch) {
  return (e) => {
    let handlerLevel = 1000 // 默认都处理
    // 先看是否传入 errorHandler，如果传入，则执行用户 errorHandler，并根据处理结果设置新的 handlerLevel
    if (_.isFunction(errorHandler)) {
      handlerLevel = _getErrorHandlerLevel(errorHandler(e))
    }

    if (handlerLevel > 0 && e instanceof XMLHttpRequest) {
      // 服务端应用（非业务）非 ret 预计错误处理，如 404，400，500，非返回 json 错误
      showServerError(e.responseText)
    } else if (handlerLevel > 10 && e.ret === -1) {
      // 认证失败，该登陆未登录
      showAuthError()
    } else if (handlerLevel > 100 && dispatch) {
      dispatch({ type: COMMON_REQUEST_ERROR, payload: e })
    } else if (handlerLevel > 100) {
      const msg = e.ret ? `[code]${e.ret}, [msg]${e.msg}` : JSON.stringify(e)
      // eslint-disable-next-line no-console
      console.error(`请求出错： ${msg}`)
    }
  }
}

function _getErrorHandlerLevel(type) {
  if (type === ERROR_HANDLER_TYPE.SYSTEM) {
    return 10
  } else if (type === ERROR_HANDLER_TYPE.SYSTEM_AND_AUTH || type === true) {
    return 100
  } else if (type === ERROR_HANDLER_TYPE.ALL) {
    return 1000
  }
  return 0
}
