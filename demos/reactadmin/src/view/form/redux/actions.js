import { message } from 'antd';
import { createAction } from 'redux-actions';
import { http } from '../../../util';
import {
  STEP_FORM_STEP1,
  STEP_FORM_STEP2,
  STEP_FORM_SUBMIT,
  STEP_FORM_SUBMIT_FAILED,
  STEP_FORM_SUBMIT_SUCCESS,
  ADVANCED_FORM_POST,
  ADVANCED_FORM_SUBMIT,
  ADVANCED_FORM_SUBMIT_SUCCESS,
  ADVANCED_FORM_SUBMIT_FAILED
} from './constants';

export const onStepFormFirst = createAction(STEP_FORM_STEP1);
export const onStepFormSecond = createAction(STEP_FORM_STEP2);
const stepFormSubmit = createAction(STEP_FORM_SUBMIT);
const stepFormSubmitSuccess = createAction(STEP_FORM_SUBMIT_SUCCESS);
const stepFormSubmitFailed = createAction(STEP_FORM_SUBMIT_FAILED);
export function onStepFormSubmit(params) {
  return (dispatch) => {
    dispatch(stepFormSubmit());
    http.post('/api/form/save', params)
      .then((response) => {
        dispatch(stepFormSubmitSuccess(response.data.data));
      })
      .catch((error) => {
        message.error('请求失败');
        dispatch(stepFormSubmitFailed(error));
      });
  };
}

export const onAdvancedFormPost = createAction(ADVANCED_FORM_POST);
const advancedFormSubmit = createAction(ADVANCED_FORM_SUBMIT);
const advancedFormSubmitSuccess = createAction(ADVANCED_FORM_SUBMIT_SUCCESS);
const advancedFormSubmitFailed = createAction(ADVANCED_FORM_SUBMIT_FAILED);
export function onAdvancedFormSubmit(params) {
  return (dispatch) => {
    dispatch(advancedFormSubmit());
    http.post('/api/form/save', params)
      .then((response) => {
        dispatch(advancedFormSubmitSuccess(response.data.data));
      })
      .catch((error) => {
        message.error('请求失败');
        dispatch(advancedFormSubmitFailed(error));
      });
  };
}
