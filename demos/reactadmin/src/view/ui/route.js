import AlertView from './Alert';
import ButtonView from './Button';
import IconView from './Icon';
import ModalView from './Modal';
import TableView from './Table';

export default [{
  path: '/ui/general/button',
  component: ButtonView
}, {
  path: '/ui/general/icon',
  component: IconView
}, {
  path: '/ui/data/table',
  component: TableView
}, {
  path: '/ui/feedback/alert',
  component: AlertView
}, {
  path: '/ui/feedback/modal',
  component: ModalView
}];
