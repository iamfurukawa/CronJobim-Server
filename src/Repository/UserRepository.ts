import { EntityRepository, Repository } from "typeorm"

import User from "../entities/User"
import Webhook from "../entities/Webhook"
import Reminder from "../entities/Reminder"

@EntityRepository(User)
class UserRepository extends Repository<User> {
    async findByEmail(email: string) {
        return await this.findOne({ 
            where: {
                email
            }
        })
    }

    async findOwner(reminderId: string | number) {
        return await this.createQueryBuilder('user')
            .innerJoin(Webhook, 'webhook', 'user.id = webhook.owner')
            .innerJoin(Reminder, 'reminder', 'webhook.id = reminder.webhook')
            .where('reminder.id = :reminderId', {reminderId})
            .getOne()
    }

    async findSubscrptionsByReminderId(id: string | number) {
        return await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.subscribed', 'reminder')
            .where('reminder.id = :id', {id})
            .select(['user.id', 'user.username'])
            .getMany() || []
    }

    async findAccess(id: string | number) {
        return await this.createQueryBuilder('user')
            .leftJoinAndSelect('user.subscribed', 'reminder')
            .where('reminder.id = :id', {id})
            .select(['user.id', 'user.username', 'user.email'])
            .getMany() || []
    }

    async mapAndSave(body: any) {
        const user = new User()
        user.username = body.username
        user.password = body.password
        user.email = body.email
        user.webhooks = []
        user.subscribed = []
        return await this.save(user)
    }

    async mapAndUpdate(user: User, body: any) {
        user.username = body.username
        user.password = body.password
        user.email = body.email
        await this.update(user.id, user)
    }
}

export default UserRepository