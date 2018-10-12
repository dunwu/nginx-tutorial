import ResultView from './Result';
import WelcomeView from './Welcome';

export default [{
  path: '/home',
  component: WelcomeView
}, {
  path: '/general/welcome',
  component: WelcomeView
}, {
  path: '/general/result',
  component: ResultView
}];
