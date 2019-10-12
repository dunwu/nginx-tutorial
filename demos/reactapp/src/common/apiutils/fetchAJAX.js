import 'isomorphic-fetch'
import { defaultJsonOptions, defaultOptions, getRealUrl, REQ_TYPE, wrapErrorHandler } from './ajaxCommon'

function handleStatus(res) {
  if (res.ok) {
    return res
  }
  throw new Error({ result: res.status })
}

// json 有固定的格式，所以固定处理方法
function handleJson(data) {
  // noinspection JSUnresolvedVariable
  if (data.ret === 0) {
    return data.data
  }
  throw new Error(data)
}

export function doFetch(options = {}, dispatch) {
  const opts = {
    ...defaultOptions,
    ...options,
    onError: wrapErrorHandler(options.onError, dispatch)
  }

  // 根据配置创建 Request 对象
  const req = new Request(getRealUrl(opts.url), {
    method: opts.method,
    headers: opts.headers,
    body: opts.data,
    cache: opts.cache,
    redirect: 'follow',
    mode: 'cors'
  })

  if (!__DEV__) {
    req.credentials = 'include'
  }

  // 请求
  // FIXME 应该根据 response 类型自动判断是否 Json 请求
  let tempRes = fetch(req).then(handleStatus)
  if (options.type === REQ_TYPE.JSON) {
    tempRes = tempRes.then(res => res.json()).then(handleJson)
  }
  tempRes.then(options.onSuccess).catch(options.onError)
}

export function doFetchJson(options = {}, dispatch) {
  const opts = { ...defaultJsonOptions, ...options }
  doFetch(opts, dispatch)
}
