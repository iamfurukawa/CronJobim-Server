import { Request, Response } from "express"
import { getRepository, getCustomRepository } from "typeorm"

import User from "../entities/User"
import Reminder from "../entities/Reminder"
import UserRepository from "../Repository/UserRepository"
import ReminderRepository from "../Repository/ReminderRepository"

class SubscriberController {
    async update(req: Request, res: Response) {
        const { reminderId, usersId, action } = req.body

        const reminder = await getRepository(Reminder).findOne(reminderId)
        if(!reminder)
            return res.status(404).json({ 'error' : 'Reminder not found.' })

        const owner = await getCustomRepository(UserRepository).findOwner(reminderId)
        if(owner && usersId.includes(owner.id))
            return res.status(400).json({ 'error' : 'You cannot subscribe in your reminder.' })

        const users = await getRepository(User).findByIds(usersId)
        await getCustomRepository(ReminderRepository).subscribe(reminder, users, action)
        return res.status(200).send()
    }
}

export default new SubscriberController()