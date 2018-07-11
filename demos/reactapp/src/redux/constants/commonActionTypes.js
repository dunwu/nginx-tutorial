/**
 * 公共的请求失败 Action 。用于 api 请求未传入错误处理函数。<br />
 * 如果传入 dispatch，则会 dispatch 该 action。<br />
 * 如果无 dispatch，则 console.log error
 * @type {string}
 */
export const COMMON_REQUEST_ERROR = 'COMMON_REQUEST_ERROR';

/**
 * 公共的 SpinModal action。用于控制统一的过度形式的模态框展示。
 * 各类型，配合 payload 中的 type 等字段控制。
 * @type {string}
 */
export const COMMON_SPIN_MODAL = 'COMMON_SPIN_MODAL';

/**
 * 公共的 SpinModal action。用于控制统一的过度形式的模态框消失。
 * @type {string}
 */
export const COMMON_SPIN_MODAL_DIS = 'COMMON_SPIN_MODAL_DIS';

// 校验
export const COMMON_VALIDATE_FAIL = 'COMMON_VALIDATE_FAIL';

/**
 * 公共的页面离开（跳转）确认功能开关
 * @type {string}
 */
export const COMMON_LEAVE_CONFIRM_ON = 'COMMON_LEAVE_CONFIRM_ON';
export const COMMON_LEAVE_CONFIRM_OFF = 'COMMON_LEAVE_CONFIRM_OFF';
