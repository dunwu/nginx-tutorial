import { message } from 'antd';
import { createAction } from 'redux-actions';
import http from '../../../../util/http';
import {
  EXAMPLE_BASIC_TABLE_LIST_SEARCH,
  EXAMPLE_BASIC_TABLE_LIST_SEARCH_FAILED,
  EXAMPLE_BASIC_TABLE_LIST_SEARCH_SUCCESS
} from './constants';

const basicTableListSearch = createAction(EXAMPLE_BASIC_TABLE_LIST_SEARCH);
const basicTableListSearchSuccess = createAction(EXAMPLE_BASIC_TABLE_LIST_SEARCH_SUCCESS);
const basicTableListSearchFailed = createAction(EXAMPLE_BASIC_TABLE_LIST_SEARCH_FAILED);
export default function onBasicTableListSearch(params) {
  return (dispatch) => {
    dispatch(basicTableListSearch());
    http.get('/ui/table/basic/list', { params })
      .then((response) => {
        dispatch(basicTableListSearchSuccess(response.data.data));
      })
      .catch((error) => {
        message.error('查询表格数据失败');
        dispatch(basicTableListSearchFailed(error));
      });
  };
}
