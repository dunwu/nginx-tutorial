import AdvancedForm from './AdvancedForm';
import FormResult from './AdvancedForm/FormResult';
import BasicForm from './BasicForm';
import StepForm from './StepForm';
import Step1 from './StepForm/Step1';
import Step2 from './StepForm/Step2';
import Step3 from './StepForm/Step3';

export default [{
  path: '/form/basic',
  component: BasicForm
}, {
  path: '/form/advanced',
  component: AdvancedForm
}, {
  path: '/form/result',
  component: FormResult
}, {
  path: '/form/step',
  component: StepForm
}, {
  path: '/form/step/first',
  component: Step1
}, {
  path: '/form/step/second',
  component: Step2
}, {
  path: '/form/step/third',
  component: Step3
}];
