import 'babel-polyfill';
import Controller from './scripts/Controller';

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
const controller = new Controller();
ready(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js');
  }
  controller.init();
});
