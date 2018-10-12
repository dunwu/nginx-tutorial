import Error403 from './403';
import Error404 from './404';
import Error500 from './500';

export default [{
  path: '/error/403',
  component: Error403
}, {
  path: '/error/404',
  component: Error404
}, {
  path: '/error/500',
  component: Error500
}];
