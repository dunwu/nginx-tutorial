import { createSelector } from 'reselect';

export const formviewSelector = state => state.formview;
export const stepSelector = createSelector(formviewSelector, formview => (formview.step));
export const advancedSelector = createSelector(formviewSelector, formview => (formview.advanced));
