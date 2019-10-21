const createApi = fetchFunc => options => (...args) => {
  let finalOpts
  const argsName = ['options', 'successCallBack', 'errorCallBack', 'dispatch']
  // options 可以是 url，或完整的 options 对象
  if (typeof options === 'string') {
    finalOpts = { url: options }
  } else {
    finalOpts = { ...options }
  }

  const temArgs = {}
  if (args) {
    // args 第一个参数，options 可以忽略
    let i = 0
    if (args[0] !== null && typeof args[0] === 'object') {
      i = 1
      finalOpts = Object.assign(finalOpts, args[0])
    }

    // eslint-disable-next-line no-plusplus
    for (let j = i; j < args.length; j++) {
      // eslint-disable-next-line no-mixed-operators
      temArgs[argsName[j - i + 1]] = args[j]
    }
  }

  if (temArgs.successCallBack) {
    finalOpts.onSuccess = temArgs.successCallBack
  }

  if (temArgs.errorCallBack) {
    finalOpts.onError = temArgs.errorCallBack
  }
  fetchFunc(finalOpts, temArgs.dispatch)
}

export default createApi
