const webapi = require('../../webapi')
import { REFRESH_MENU, REFRESH_NAVPATH } from '../constants/menuActionType'

export const refreshNavPath = (path, key) => {
  return {
    type: REFRESH_NAVPATH,
    payload: {
      data: path,
      key: key
    }
  }
}

export const refreshMenu = () => {
  return {
    type: REFRESH_MENU,
    payload: {
      promise: webapi.get('/menu')
    }
  }
}
