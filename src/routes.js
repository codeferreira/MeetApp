import { Router } from 'express';

import UserController from './app/controllers/User';
import SessionController from './app/controllers/Session';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', UserController.update);

routes.post('/sessions', SessionController.store);

export default routes;
