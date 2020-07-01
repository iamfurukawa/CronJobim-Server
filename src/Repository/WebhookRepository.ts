import { EntityRepository, Repository } from "typeorm"

import Webhook from "../entities/Webhook"
import User from "../entities/User"

@EntityRepository(Webhook)
class WebhookRepository extends Repository<Webhook> {
    async findWebhooksByUserId(id: string | number) {
        return await this.createQueryBuilder('webhook')
            .leftJoinAndSelect('webhook.owner', 'user')
            .where('user.id = :id', {id})
            .select([
                'webhook.id',
                'webhook.alias',
                'webhook.webhook'
            ])
            .getMany() || []
    }

    async findById(id: string | number): Promise<Webhook | undefined> {
        return await this.createQueryBuilder('webhook')
            .leftJoinAndSelect('webhook.owner', 'user')
            .where('webhook.id = :id', {id})
            .select(['webhook', 'user.id', 'user.username'])
            .getOne()
    }

    async mapAndSave(owner: User, body: any) {
        const webhook = new Webhook()
        webhook.alias = body.alias
        webhook.webhook = body.webhook
        webhook.reminders = []
        webhook.owner = owner
        return await this.save(webhook)
    }

    async mapAndUpdate(webhook: Webhook, owner: User, body: any) {
        webhook.alias = body.alias
        webhook.webhook = body.webhook
        webhook.owner = owner
        await this.update(webhook.id, webhook)
    }
}

export default WebhookRepository