/**
 * export 一个 API，底层的实现可能会改（如，切换为 reqwest/superagent/fetch）
 */
import { CACHE_TYPE, ERROR_HANDLER_TYPE, METHODS, REQ_TYPE } from './ajaxCommon'
import { doBiJsonFetch, doFetch, doFetchJson } from './reqwestAJAX'
import createApi from './apiCreator'

/**
 * 创建一个 API 函数，结果可以是任何形式。如果是响应是 JSON 会自动转换，类似于 #createFetchJson 结果。<br />
 * 但是，请求头不指名 Json ： Accept:text/javascript, text/html, application/xml, text/xml, *\/*
 */
const createFetch = createApi(doFetch)

/**
 * 创建一个 API 函数，明确指明函数用于获取 Json 格式数据。如果结果不符合格式会转到错误处理 <br />
 * 请求头：Accept:application/json, text/plain, *\/*
 */
const createFetchJson = createApi(doFetchJson)

// 创建一个 API 函数, 指明客户端、服务端 内容体（content body）都是 Json 格式。<br />
// 在 #createFetchJson 的基础上添加：Content-Type: application/json;charset=UTF-8，<br />
// 同时，如果请求 data 为 Object类型会通过 JSON.stringify 转换
const createBiJsonFetch = createApi(doBiJsonFetch)

/**
 * 将 api 转换为返回 Promise 方式, 不处理 error。 如果处理 error， 请君自new
 * @private
 */
const createPromiseAPI = api => (data) => {
  return new Promise((resolve) => {
    api({ data }, rs => resolve(rs))
  })
}

const API = {
  METHODS,
  REQ_TYPE,
  CACHE_TYPE,
  ERROR_HANDLER_TYPE,
  doFetch,
  doFetchJson,
  createFetch,
  createFetchJson,
  createBiJsonFetch,
  createPromiseAPI
}

export default API
