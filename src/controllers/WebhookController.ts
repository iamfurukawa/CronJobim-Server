import { Request, Response } from "express"
import { getRepository, getCustomRepository } from "typeorm"

import WebhookEntity from '../entities/Webhook'
import WebhookRepository from "../Repository/WebhookRepository"
import User from "../entities/User"
import MapperService from "../Services/MapperService"

class WebhookController {
    async store(req: Request, res: Response) {
        const owner = await getRepository(User).findOne(req.body.ownerId)

        if (!owner)
            return res.status(404).json({ 'error' : 'User not found.' })

        const webhookSaved = await getCustomRepository(WebhookRepository).mapAndSave(owner, req.body)
        return res.status(200).json(MapperService.mapWebhookEntityToModel(webhookSaved))
    }

    async index(req: Request, res: Response) {
        const { id } = req.params

        const webhook = await getCustomRepository(WebhookRepository).findById(id)
        if(!webhook)
            return res.status(404).json({ 'error' : 'Webhook not found.' })
            
        return res.status(200).json(MapperService.mapWebhookEntityToModel(webhook))
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        const owner = await getRepository(User).findOne(req.body.ownerId)
        if (!owner)
            return res.status(404).json({ 'error' : 'User not found.' })

        const webhookSaved = await getRepository(WebhookEntity).findOne(id)
        if (!webhookSaved)
            return res.status(404).json({ 'error' : 'Webhook not found.' })
        
        await getCustomRepository(WebhookRepository).mapAndUpdate(webhookSaved, owner, req.body)
        return res.status(200).send()
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        const webhook = await getRepository(WebhookEntity).findOne(id)
        if (!webhook) 
            return res.status(404).json({ 'error' : 'Webhook not found.' })

        await getRepository(WebhookEntity).remove(webhook)
        return res.status(200).send()
    }
}

export default new WebhookController()