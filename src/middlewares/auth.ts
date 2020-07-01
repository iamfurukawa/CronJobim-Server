import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import { NextFunction, Request, Response } from 'express'
import authConfig from '../configurations/jwtconfig'

export default async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization
    const secret = authConfig.secret

    if (!authHeader) {
        return res.status(401).json({ error: 'Token not provided' })
    }

    const [, token] = authHeader.split(' ')

    try {
        await promisify(jwt.verify)(token, secret)
        return next();
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' })
    }
};
