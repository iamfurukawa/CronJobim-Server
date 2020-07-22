import { Router } from 'express'
import { check, check } from 'express-validator'

import loggerMiddleware from './middlewares/logger'
import jwtMiddleware from './middlewares/auth'
import errorMiddleware from './middlewares/error'

import AuthenticationController from './controllers/AuthenticationController'
import UserController from './controllers/UserController'
import ReminderController from './controllers/ReminderController'
import WebhookController from './controllers/WebhookController'
import SubscriberController from './controllers/SubscriberController'

const routes = Router()

routes.use(loggerMiddleware)

routes.get('/v1/auth', [
    check('email').isEmail(),
    check('password').notEmpty(),
    errorMiddleware
    ], AuthenticationController.store)

routes.post('/v1/users', [
    check('email').isEmail(),
    check('password').notEmpty(),
    check('username').notEmpty(),
    errorMiddleware
    ], UserController.store)

routes.use(jwtMiddleware)

routes.get('/v1/users/:id', UserController.index)
routes.put('/v1/users/:id', [
    check('email').isEmail(),
    check('password').notEmpty(),
    errorMiddleware
    ], UserController.update)
routes.delete('/v1/users/:id', UserController.delete)

routes.get('/v1/users/:id/hooks', UserController.searchByHooks)
routes.get('/v1/users/:id/reminders', UserController.searchByReminders)
routes.get('/v1/users/:id/subscriptions', UserController.searchBySubscriptions)

routes.post('/v1/reminders', [
    check('message').isString().notEmpty(),
    check('webhookId').notEmpty(),
    check('startDate').notEmpty(),
    check('endDate').notEmpty(),
    check('active').isBoolean().notEmpty(),
    check('repeat').notEmpty(),
    check('ignore').notEmpty(),
    errorMiddleware
    ], ReminderController.store)
routes.get('/v1/reminders/:id', ReminderController.index)
routes.put('/v1/reminders/:id', [
    check('message').isString().notEmpty(),
    check('webhookId').isInt().notEmpty(),
    check('startDate').notEmpty(),
    check('endDate').notEmpty(),
    check('active').isBoolean().notEmpty(),
    check('repeat').notEmpty(),
    check('ignore').notEmpty(),
    check('requestBy').isInt().notEmpty(),
    errorMiddleware
    ], ReminderController.update)
routes.delete('/v1/reminders/:id', ReminderController.delete)

routes.get('/v1/reminders/:id/subscribers', ReminderController.searchBySubscriptions)

routes.post('/v1/webhooks', [
    check('alias').isString().notEmpty(),
    check('webhook').isURL().notEmpty(),
    check('ownerId').isInt().notEmpty(),
    errorMiddleware
    ], WebhookController.store)
routes.get('/v1/webhooks/:id', WebhookController.index)
routes.put('/v1/webhooks/:id', [
    check('alias').isString().notEmpty(),
    check('webhook').isURL().notEmpty(),
    check('ownerId').isInt().notEmpty(),
    errorMiddleware
    ], WebhookController.update)
routes.delete('/v1/webhooks/:id', WebhookController.delete)

routes.put('/v1/subscribers', [
    check('reminderId').notEmpty(),
    check('usersId').isArray(),
    errorMiddleware
    ], SubscriberController.update)

export default routes