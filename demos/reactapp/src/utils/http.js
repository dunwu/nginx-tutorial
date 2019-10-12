/**
 * @file 封装支持 promise 的 http 请求工具
 * @author Zhang Peng
 * @see https://github.com/mzabriskie/axios
 * @see http://www.jianshu.com/p/df464b26ae58
 */

const axios = require('axios')
const qs = require('qs')

import config from '../../config/app.config'

// 本项目中 axios 的默认全局配置
axios.defaults.timeout = config.http.timeout
axios.defaults.baseURL = config.http.baseURL

axios.defaults.headers.get['Content-Type'] = 'application/json'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.put['Content-Type'] = 'application/json'

// 本项目的默认配置
const defaultConfig = {
  //`url` 是请求的服务器地址
  // url: '/user',

  //`method` 是请求资源的方式
  // method: 'get', //default

  //如果`url`不是绝对地址，那么`baseURL`将会加到`url`的前面
  //当`url`是相对地址的时候，设置`baseURL`会非常的方便
  baseURL: config.http.baseURL,

  //`transformRequest` 选项允许我们在请求发送到服务器之前对请求的数据做出一些改动
  //该选项只适用于以下请求方式：`put/post/patch`
  //数组里面的最后一个函数必须返回一个字符串、-一个`ArrayBuffer`或者`Stream`

  transformRequest: [function(data) {
    // 序列化
    if (data) {
      console.log('[request after stringify] data: ', JSON.stringify(data))
      return JSON.stringify(data)
    }
  }],

  //`transformResponse` 选项允许我们在数据传送到`then/catch`方法之前对数据进行改动
  transformResponse: [function(data) {
    // 反序列化
    if (data) {
      console.log('[response after parse] data: ', JSON.parse(data))
      return JSON.parse(data)
    }
  }],

  //`headers`选项是需要被发送的自定义请求头信息
  headers: { 'X-Requested-With': 'XMLHttpRequest' },

  //`params`选项是要随请求一起发送的请求参数----一般链接在URL后面
  //他的类型必须是一个纯对象或者是URLSearchParams对象
  // params: {
  //   ID: 12345
  // },

  //`paramsSerializer`是一个可选的函数，起作用是让参数（params）序列化
  //例如(https://www.npmjs.com/package/qs,http://api.jquery.com/jquery.param)
  paramsSerializer: function(params) {
    const content = qs.stringify(params, { arrayFormat: 'brackets' })
    console.log('[http] params 序列化后：', content)
    return content
  },

  //`data`选项是作为一个请求体而需要被发送的数据
  //该选项只适用于方法：`put/post/patch`
  //当没有设置`transformRequest`选项时dada必须是以下几种类型之一
  //string/plain/object/ArrayBuffer/ArrayBufferView/URLSearchParams
  //仅仅浏览器：FormData/File/Bold
  //仅node:Stream
  // data: {
  //   firstName: "Fred"
  // },

  //`timeout` 选项定义了请求发出的延迟毫秒数
  //如果请求花费的时间超过延迟的时间，那么请求会被终止
  timeout: config.http.timeout,

  //`withCredentails`选项表明了是否是跨域请求
  // withCredentials: false,//default

  //`adapter`适配器选项允许自定义处理请求，这会使得测试变得方便
  //返回一个promise,并提供验证返回
  // adapter: function (config) {
  //   /*..........*/
  // },

  //`auth` 表明HTTP基础的认证应该被使用，并提供证书
  //这会设置一个authorization头（header）,并覆盖你在header设置的Authorization头信息
  // auth: {
  //   username: "zhangsan",
  //   password: "s00sdkf"
  // },

  //返回数据的格式
  //其可选项是arraybuffer,blob,document,json,text,stream
  // responseType: 'json',//default

  //
  xsrfCookieName: 'XSRF-TOKEN',//default
  xsrfHeaderName: 'X-XSRF-TOKEN',//default

  //`onUploadProgress`上传进度事件
  onUploadProgress: function(progressEvent) {
  },

  //下载进度的事件
  onDownloadProgress: function(progressEvent) {
  },

  //相应内容的最大值
  maxContentLength: 2000,

  //`validateStatus`定义了是否根据http相应状态码，来resolve或者reject promise
  //如果`validateStatus`返回true(或者设置为`null`或者`undefined`),那么promise的状态将会是resolved,否则其状态就是rejected
  validateStatus: function(status) {
    return status >= 200 && status < 300//default
  }

  //`maxRedirects`定义了在nodejs中重定向的最大数量
  // maxRedirects: 5,//default

  //`httpAgent/httpsAgent`定义了当发送http/https请求要用到的自定义代理
  //keeyAlive在选项中没有被默认激活
  // httpAgent: new http.Agent({ keeyAlive: true }),
  // httpsAgent: new https.Agent({ keeyAlive: true }),

  //proxy定义了主机名字和端口号，
  //`auth`表明http基本认证应该与proxy代理链接，并提供证书
  //这将会设置一个`Proxy-Authorization` header,并且会覆盖掉已经存在的`Proxy-Authorization`  header
  // proxy: {
  //  host: '127.0.0.1',
  //  port: 9000,
  //  auth: {
  //  username: 'skda',
  //  password: 'radsd'
  //  }
  //  },

  //`cancelToken`定义了一个用于取消请求的cancel token
  //详见cancelation部分
  // cancelToken: new CancelToken(function (cancel) {
  // })
}
// 使用默认配置初始化的请求
const http = axios.create(defaultConfig)
export default http
