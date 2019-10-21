import _ from 'lodash'

import { REFRESH_MENU_SUCCESS, REFRESH_NAVPATH } from '../constants/menuActionType'

const initialState = {
  items: [],
  navpath: []
}

const menu = (state = initialState, action = {}) => {
  switch (action.type) {
    case REFRESH_MENU_SUCCESS:
      return Object.assign({}, initialState, {
        items: action.payload.data.data
      })
    case REFRESH_NAVPATH:
      let navpath = [], tmpOb, tmpKey, children
      if (Array.isArray(action.payload.data)) {
        action.payload.data.reverse().map((item) => {
          if (item.indexOf('sub') !== -1) {
            tmpKey = item.replace('sub', '')
            tmpOb = _.find(state.items, function(o) {
              return o.key == tmpKey
            })
            children = tmpOb.children
            navpath.push({
              key: tmpOb.key,
              title: tmpOb.title,
              icon: tmpOb.icon,
              type: tmpOb.type,
              url: tmpOb.url
            })
          }
          if (item.indexOf('menu') !== -1) {
            tmpKey = item.replace('menu', '')
            if (children) {
              tmpOb = _.find(children, function(o) {
                return o.key == tmpKey
              })
              navpath.push({
                key: tmpOb.key,
                title: tmpOb.title,
                icon: tmpOb.icon,
                type: tmpOb.type,
                url: tmpOb.url
              })
            }
          }
        })
      }
      return Object.assign({}, state, {
        currentIndex: action.payload.key * 1,
        navpath: navpath
      })
    default:
      return state
  }
}
export default menu
