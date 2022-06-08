import Router from './router';

const router = new Router();
const app = document.getElementById('app');

router.get('/test/:label1/*/*/*/:label2', (options) => {
  app.innerHTML = `<pre>${JSON.stringify(options, null, 2)}</pre>`;
});
