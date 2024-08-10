import Router from './routes/Router.js';

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    if (app) {
        Router.init(app);
    }
});
