import _ from 'lodash';
import {
  EXAMPLE_BASIC_TABLE_LIST_SEARCH,
  EXAMPLE_BASIC_TABLE_LIST_SEARCH_FAILED,
  EXAMPLE_BASIC_TABLE_LIST_SEARCH_SUCCESS
} from './constants';

const initState = {
  loading: true,
  list: []
};

const table = (state = initState, action = {}) => {
  switch (action.type) {
  case EXAMPLE_BASIC_TABLE_LIST_SEARCH: {
    return state;
  }
  case EXAMPLE_BASIC_TABLE_LIST_SEARCH_SUCCESS: {
    return { ...state, loading: false, list: _.get(action, ['payload'], action) };
  }
  case EXAMPLE_BASIC_TABLE_LIST_SEARCH_FAILED: {
    return { ...state, loading: false, list: [] };
  }
  default:
    return state;
  }
};
export default table;
