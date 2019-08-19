import { Router } from 'express';

import UserController from './app/controllers/User';
import SessionController from './app/controllers/Session';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', authMiddleware, UserController.update);

routes.post('/sessions', SessionController.store);

export default routes;
