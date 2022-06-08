import Router from './router';

const router = new Router();
const app = document.getElementById('app');

router.get('/test/:label1/to/:label2', (request) => {
  app.innerHTML = `<pre>${JSON.stringify(request, null, 2)}</pre>`;
});
