import 'babel-polyfill';

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}
ready(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/worker.js');
  }
});
