import { Router } from 'express'

import loggerMiddleware from './middlewares/logger'
import jwtMiddleware from './middlewares/auth'

import AuthenticationController from './controllers/AuthenticationController'
import UserController from './controllers/UserController'
import ReminderController from './controllers/ReminderController'
import WebhookController from './controllers/WebhookController'
import SubscriberController from './controllers/SubscriberController'

const routes = Router()

routes.use(loggerMiddleware)

routes.get('/v1/auth', AuthenticationController.store)
routes.post('/v1/users', UserController.store)

routes.use(jwtMiddleware)

routes.get('/v1/users/:id', UserController.index)
routes.put('/v1/users/:id', UserController.update)
routes.delete('/v1/users/:id', UserController.delete)

routes.get('/v1/users/:id/hooks', UserController.searchByHooks)
routes.get('/v1/users/:id/reminders', UserController.searchByReminders)
routes.get('/v1/users/:id/subscriptions', UserController.searchBySubscriptions)

routes.post('/v1/reminders', ReminderController.store)
routes.get('/v1/reminders/:id', ReminderController.index)
routes.put('/v1/reminders/:id', ReminderController.update)
routes.delete('/v1/reminders/:id', ReminderController.delete)

routes.get('/v1/reminders/:id/subscribers', ReminderController.searchBySubscriptions)

routes.post('/v1/webhooks', WebhookController.store)
routes.get('/v1/webhooks/:id', WebhookController.index)
routes.put('/v1/webhooks/:id', WebhookController.update)
routes.delete('/v1/webhooks/:id', WebhookController.delete)

routes.put('/v1/subscribers', SubscriberController.update)

export default routes