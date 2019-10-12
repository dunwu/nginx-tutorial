const webapi = require('../../webapi')
import { FETCH_PROFILE, LOGIN, LOGOUT, UID_NOT_FOUND } from '../constants/authActionType'

export const fetchProfile = () => {
  let uid = window.localStorage.getItem('uid')

  if (uid === undefined) {
    return { type: UID_NOT_FOUND }
  }

  return {
    type: FETCH_PROFILE,
    payload: {
      promise: webapi.get('/my')
    }
  }
}

export const login = (username, password) => {
  return {
    type: LOGIN,
    payload: {
      promise: webapi.put('/login', {
        username: username,
        password: password
      })
    }
  }
}

export const logout = () => {
  return {
    type: LOGOUT,
    payload: {
      promise: webapi.get('/logout')
    }
  }
}
