import { Request, Response } from 'express'
import { getCustomRepository } from 'typeorm'
import bcrypt from 'bcryptjs'

import AuthenticationService from '../Services/AuthenticationService'
import UserRepository from '../Repository/UserRepository'

class AuthenticationController {
    async store(req: Request, res: Response) {
        const { email, password } = req.body
        
        const user = await getCustomRepository(UserRepository).findByEmail(email)
        if (!user)
            return res.status(404).json({ 'error': 'User not found' })
            
        if (!(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ 'error': 'Password doesn\'t match' })

        return res.status(200).json(AuthenticationService.sign(user))
    }
}

export default new AuthenticationController()