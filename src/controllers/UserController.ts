import { Request, Response } from "express"
import { getRepository, getCustomRepository } from "typeorm"

import UserEntity from "../entities/User"
import UserRepository from "../Repository/UserRepository"
import ReminderRepository from "../Repository/ReminderRepository"
import WebhookRepository from "../Repository/WebhookRepository"
import MapperService from "../Services/MapperService"

class UserController {
    async store(req: Request, res: Response) {
        const { email } = req.body

        const user = await getCustomRepository(UserRepository).findByEmail(email)
        if(user)
            return res.status(409).json({ 'error' : 'User already exists.' })

        const userSaved = await getCustomRepository(UserRepository).mapAndSave(req.body)
        res.status(200).json(MapperService.mapUserEntityToModel(userSaved))
    }

    async index(req: Request, res: Response) {
        const { id } = req.params

        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })

        return res.status(200).json(MapperService.mapUserEntityToModel(user))
    }

    async update(req: Request, res: Response) {
        const { id } = req.params
        const { email } = req.body

        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })

        const userExists = await getCustomRepository(UserRepository).findByEmail(email)
        if(userExists && userExists.id !== user.id)
            return res.status(409).json({ 'error' : 'User already exists.' })
        
        await getCustomRepository(UserRepository).mapAndUpdate(user, req.body)
        return res.status(200).send()
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })
        
        await getRepository(UserEntity).remove(user)
        return res.status(200).send()
    }

    async searchByHooks(req: Request, res: Response) {
        const { id } = req.params
        
        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })

        const webhooks = await getCustomRepository(WebhookRepository).findWebhooksByUserId(id)
        return res.status(200).json({'webhooks': webhooks})
    }

    async searchByReminders(req: Request, res: Response) {
        const { id } = req.params

        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })

        const reminders = await getCustomRepository(ReminderRepository).findRemindersByUserId(id)
        return res.status(200).json({'reminders': reminders})
    }

    async searchBySubscriptions(req: Request, res: Response) {
        const { id } = req.params

        const user = await getRepository(UserEntity).findOne(id)
        if(!user)
            return res.status(404).json({ 'error' : 'User not found.' })

        const subscriptions = await getCustomRepository(ReminderRepository).findSubscrptionsByUserId(id)
        return res.status(200).json({'subscriptions': subscriptions})
    }
}

export default new UserController()