import { EntityRepository, Repository } from "typeorm"

import User from "../entities/User"
import Webhook from "../entities/Webhook"
import Reminder from "../entities/Reminder"
import ActionType from "../utils/ActionType"

@EntityRepository(Reminder)
class ReminderRepository extends Repository<Reminder> {
    async subscribe(reminder: Reminder, users: User[], action: ActionType) {
        reminder.access = users
        reminder.action = action || reminder.action
        await this.save(reminder)
    }

    async findSubscrptionsByUserId(id: string | number) {
        return await this.createQueryBuilder('reminder')
            .leftJoinAndSelect('reminder.access', 'subscribed')
            .where('subscribed.id = :id', {id})
            .select(['reminder.id', 'reminder.message', 'reminder.active', 'reminder.action'])
            .getMany() || []
    }

    async findRemindersByUserId(id: string | number) {
        return await this.createQueryBuilder('reminder')
            .leftJoinAndSelect('reminder.webhook', 'webhook')
            .where('webhook.id in (:id)', {id})
            .select([
                'reminder.id',
                'reminder.message',
                'reminder.startDate',
                'reminder.endDate',
                'reminder.nextExecution',
                'reminder.repeat',
                'reminder.ignore',
                'reminder.active',
            ])
            .getMany() || []
    }

    async findReminder(id: string | number) {
        return await this.createQueryBuilder('reminder')
            .leftJoinAndSelect('reminder.webhook', 'webhook')
            .where('reminder.id = :id', {id})
            .getOne()
    }

    async mapAndUpdate(reminder: Reminder, body: any, webhook: Webhook, access: User[]) {
        reminder.message = body.message
        reminder.webhook = webhook
        reminder.startDate = body.startDate
        reminder.active = body.active
        reminder.repeat = body.repeat
        reminder.ignore = body.ignore
        reminder.endDate = body.endDate
        reminder.access = access
        reminder.nextExecution = body.nextExecution
        reminder.action = body.action
        await this.save(reminder)
    }

    async mapAndSave(body: any, webhook: Webhook, access: User[]) {
        const reminder = new Reminder()
        reminder.id = body.id
        reminder.message = body.message
        reminder.webhook = webhook
        reminder.startDate = new Date(body.startDate)
        reminder.active = body.active
        reminder.repeat = body.repeat
        reminder.ignore = body.ignore
        reminder.endDate = new Date(body.endDate)
        reminder.access = access
        reminder.action = !access ? body.action : "Can view"
        reminder.nextExecution = new Date()
        return await this.save(reminder)
    }
}

export default ReminderRepository