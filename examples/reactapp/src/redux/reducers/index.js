/**
 * Created by Zhang Peng on 2017/7/6.
 */
import { combineReducers } from 'redux'
import auth from './auth'
import menu from './menu'

const rootReducer = combineReducers({
  auth,
  menu
})
export default rootReducer
