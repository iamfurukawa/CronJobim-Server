import { getRepository, getCustomRepository } from "typeorm"
import { Request, Response } from "express"

import ReminderEntity from '../entities/Reminder'
import ReminderRepository from "../Repository/ReminderRepository"
import Webhook from "../entities/Webhook"
import UserRepository from "../Repository/UserRepository"
import MapperService from "../Services/MapperService"

class ReminderController {
    async store(req: Request, res: Response) {
        const webhook = await getRepository(Webhook).findOne(req.body.webhookId)
        if (!webhook)
            return res.status(404).json({ 'error' : 'Webhook not found.' })

        const reminderSaved = await getCustomRepository(ReminderRepository).mapAndSave(req.body, webhook, [])
        return res.status(201).json(MapperService.mapReminderEntityToModel(reminderSaved))
    }

    async index(req: Request, res: Response) {
        const { id } = req.params

        const reminder = await getCustomRepository(ReminderRepository).findReminder(id)
        if(!reminder)
            return res.status(404).json({ 'error' : 'Reminder not found.' })

        return res.status(200).json(MapperService.mapReminderEntityToModel(reminder))
    }

    async update(req: Request, res: Response) {
        const { id } = req.params
        const { requestBy } = req.body

        const webhookSaved = await getRepository(Webhook).findOne(req.body.webhookId)
        if (!webhookSaved)
            return res.status(404).json({ 'error' : 'Webhook not found.' })

        const reminder = await getRepository(ReminderEntity).findOne(id)
        if (!reminder)
            return res.status(404).json({ 'error' : 'Reminder not found.' })

        const access = await getCustomRepository(UserRepository).findAccess(id)
        const accessIds = access.map(user => user.id)

        const owner = await getCustomRepository(UserRepository).findOwner(id)
        if((owner && owner.id !== requestBy) && (accessIds && reminder.action !== 'Can edit' || !accessIds.includes(requestBy)))
            return res.status(401).json({ 'error' : 'You cannot edit this reminder.' })

        await getCustomRepository(ReminderRepository).mapAndUpdate(reminder, req.body, webhookSaved, access)
        return res.status(200).send()
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        const reminder = await getRepository(ReminderEntity).findOne(id)
        if (!reminder)
            return res.status(404).json({ 'error' : 'Reminder not found.' })

        await getRepository(ReminderEntity).remove(reminder)
        return res.status(200).send()
    }

    async searchBySubscriptions(req: Request, res: Response) {
        const { id } = req.params

        const reminder = await getRepository(ReminderEntity).findOne(id)
        if (!reminder)
            return res.status(404).json({ 'error' : 'Reminder not found.' })

        const subscriptions = await getCustomRepository(UserRepository).findSubscrptionsByReminderId(id)
        return res.status(200).json({
            'subscriptions': subscriptions,
            'action': reminder.action
        })
    }
}

export default new ReminderController()