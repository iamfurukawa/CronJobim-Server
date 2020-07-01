import WebhookEntity from '../entities/Webhook'
import WebhookModel from '../models/Webhook'
import ReminderEntity from '../entities/Reminder'
import ReminderModel from '../models/Reminder'
import UserEntity from '../entities/User'
import UserModel from '../models/User'

class MapperService {
    mapWebhookEntityToModel(webhook: WebhookEntity): WebhookModel {
        return {
            id: webhook.id,
            alias: webhook.alias,
            webhook: webhook.webhook,
            owner: {
                id: webhook.owner.id,
                username: webhook.owner.username
            },
        }
    }

    mapReminderEntityToModel(reminder: ReminderEntity): ReminderModel {
        return {
            id: reminder.id,
            message: reminder.message,
            startDate: reminder.startDate,
            endDate: reminder.endDate,
            nextExecution: new Date(),
            active: reminder.active,
            repeat: reminder.repeat,
            ignore: reminder.ignore,
            webhook: {
                'id': reminder.webhook.id,
                'alias': reminder.webhook.alias,
                'webhook': reminder.webhook.webhook
            }
        }
    }

    mapUserEntityToModel(user: UserEntity): UserModel {
        return {
            id: user.id,
            username: user.username,
            email: user.email
        }
    }
}

export default new MapperService()