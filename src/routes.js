import { Router } from 'express';

const routes = new Router();

routes.get('/', (request, response) => response.send('Hello World!'));

export default routes;
