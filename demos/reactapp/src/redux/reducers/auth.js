import {
  FETCH_PROFILE_SUCCESS,
  LOGIN_FAILED,
  LOGIN_PENDING,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS
} from '../constants/authActionType'

const initialState = {
  user: null,
  loggingIn: false,
  loggingOut: false,
  message: null
}

const auth = (state = initialState, action = {}) => {
  switch (action.type) {
    case LOGIN_PENDING:
      return Object.assign({}, state, {
        loggingIn: true
      })
    case LOGIN_SUCCESS:
      let user = action.payload.data
      window.localStorage.setItem('uid', user.uid)
      return Object.assign({}, state, {
        user: user,
        loggingIn: false,
        message: null
      })
    case LOGIN_FAILED:
      return {
        ...state,
        loggingIn: false,
        user: null,
        message: action.payload.response.data.message
      }
    case LOGOUT_SUCCESS:
      window.localStorage.removeItem('uid')
      return {
        ...state,
        loggingOut: false,
        user: null,
        message: null
      }
    case FETCH_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        user: action.payload.data,
        loggingIn: false,
        message: null
      })
    default:
      return state
  }
}
export default auth
