import _ from 'lodash';
import { MENU_ITEM_SELECTED, MENU_LIST_SEARCH, MENU_LIST_SEARCH_FAILED, MENU_LIST_SEARCH_SUCCESS } from './constants';

const MENU_ITEM_HOME_KEY = '0';

const initState = {
  loading: true,
  list: [],
  selected: {
    key: MENU_ITEM_HOME_KEY,
    keyPath: [MENU_ITEM_HOME_KEY]
  }
};

const menu = (state = initState, action = {}) => {
  switch (action.type) {
  case MENU_LIST_SEARCH: {
    return state;
  }
  case MENU_LIST_SEARCH_SUCCESS: {
    return { ...state, loading: false, list: _.get(action, ['payload'], action) };
  }
  case MENU_LIST_SEARCH_FAILED: {
    return { ...state, loading: false, list: [] };
  }
  case MENU_ITEM_SELECTED: {
    return { ...state, selected: _.get(action, ['payload'], state) };
  }
  default:
    return state;
  }
};
export default menu;
