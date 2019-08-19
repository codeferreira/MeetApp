import { Router } from 'express';

import UserController from './app/controllers/User';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

export default routes;
