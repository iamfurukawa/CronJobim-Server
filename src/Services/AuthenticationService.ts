import jwt from 'jsonwebtoken'

import Authentication from "../models/AuthenticationModel"
import User from "../entities/User"
import authConfig from '../configurations/jwtconfig'

class AuthenticationService {
    sign(user: User): Authentication {
        const { id, username, email } = user

        return {
            user: { 
                id,
                username,
                email
            },
            token: jwt.sign(
                { id },
                authConfig.secret, {
                    expiresIn: authConfig.expiresIn
            })
        }
    }
}

export default new AuthenticationService()