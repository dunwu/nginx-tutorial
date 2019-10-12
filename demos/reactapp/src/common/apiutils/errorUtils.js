/**
 * 错误处理帮助类
 */
import { Message } from 'antd'
import _ from 'lodash'

import { ERROR_HANDLER_TYPE } from './index'

/**
 * 处理业务类型的错误(-3)，通过 message 的方式展现
 * @param e
 * @param callBack
 * @return {boolean}
 */
export function messageBizError(e, callBack) {
  let continueHandler = true
  if (e && e.ret === -3) {
    // 业务错误
    Message.error(e.msg, 4.5)
    continueHandler = ERROR_HANDLER_TYPE.NO
  }
  if (_.isFunction(callBack)) {
    callBack({ error: e })
  }
  return continueHandler
}
