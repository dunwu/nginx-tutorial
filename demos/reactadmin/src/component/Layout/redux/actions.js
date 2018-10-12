import { message } from 'antd';
import { createAction } from 'redux-actions';
import http from '../../../util/http/index';
import { MENU_ITEM_SELECTED, MENU_LIST_SEARCH, MENU_LIST_SEARCH_FAILED, MENU_LIST_SEARCH_SUCCESS } from './constants';

// 查询菜单列表
const menuListSearch = createAction(MENU_LIST_SEARCH);
const menuListSearchSuccess = createAction(MENU_LIST_SEARCH_SUCCESS);
const menuListSearchFailed = createAction(MENU_LIST_SEARCH_FAILED);
export function onMenuListSearch(params) {
  return (dispatch) => {
    dispatch(menuListSearch());
    http.get('/menu/list', { params })
      .then((response) => {
        dispatch(menuListSearchSuccess(response.data.data));
      })
      .catch((error) => {
        message.error('加载菜单列表失败');
        dispatch(menuListSearchFailed(error));
      });
  };
}

// 选中菜单列表项
const menuItemSelected = createAction(MENU_ITEM_SELECTED);
export const onMenuItemSelected = (key, keyPath) => {
  return (dispatch) => {
    dispatch(menuItemSelected(key, keyPath));
  };
};
