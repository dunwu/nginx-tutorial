/**
 * @file redux reducer 的管理入口
 * @author Zhang Peng
 * @description redux reducer 的管理入口。
 * @see http://cn.redux.js.org/docs/basics/Reducers.html
 */
import { routerReducer as router } from 'react-router-redux';
import { combineReducers } from 'redux';
import menu from '../component/Layout/redux/reducers';
import formview from '../view/form/redux/reducers';
import table from '../view/ui/Table/redux/reducers';

const reducerMap = {
  router,
  menu,
  table,
  formview
};

// combineReducers 的用法可以参考以下链接的内容
// @see http://cn.redux.js.org/docs/recipes/reducers/UsingCombineReducers.html
// @see http://cn.redux.js.org/docs/recipes/reducers/BeyondCombineReducers.html
// @see http://cn.redux.js.org/docs/api/combineReducers.html
const rootReducer = combineReducers(reducerMap);
export default rootReducer;
