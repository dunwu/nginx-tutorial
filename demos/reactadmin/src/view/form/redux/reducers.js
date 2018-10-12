import _ from 'lodash';
import { combineReducers } from 'redux';
import {
  ADVANCED_FORM_SUBMIT,
  ADVANCED_FORM_SUBMIT_FAILED,
  ADVANCED_FORM_SUBMIT_SUCCESS,
  STEP_FORM_STEP1,
  STEP_FORM_STEP2,
  ADVANCED_FORM_POST,
  STEP_FORM_SUBMIT,
  STEP_FORM_SUBMIT_FAILED,
  STEP_FORM_SUBMIT_SUCCESS
} from './constants';

const stepState = {
  firstData: {},
  secondData: {},
  result: false
};
const step = (state = stepState, action = {}) => {
  switch (action.type) {
  case STEP_FORM_STEP1: {
    return { ...state, firstData: _.get(action, ['payload'], action) };
  }
  case STEP_FORM_STEP2: {
    return { ...state, secondData: _.get(action, ['payload'], action) };
  }
  case STEP_FORM_SUBMIT: {
    return state;
  }
  case STEP_FORM_SUBMIT_SUCCESS: {
    const ret = _.get(action, ['payload'], action);
    return { ...state, result: ret.result };
  }
  case STEP_FORM_SUBMIT_FAILED: {
    return { ...state };
  }
  default: {
    return state;
  }
  }
};

const advancedState = {
  data: {},
  result: false
};
const advanced = (state = advancedState, action = {}) => {
  switch (action.type) {
  case ADVANCED_FORM_POST: {
    return { ...state, data: _.get(action, ['payload'], action) };
  }
  case ADVANCED_FORM_SUBMIT: {
    return state;
  }
  case ADVANCED_FORM_SUBMIT_SUCCESS: {
    const ret = _.get(action, ['payload'], action);
    return { ...state, result: ret.result };
  }
  case ADVANCED_FORM_SUBMIT_FAILED: {
    return { ...state };
  }
  default: {
    return state;
  }
  }
};

const formview = combineReducers({
  step, advanced
});
export default formview;
