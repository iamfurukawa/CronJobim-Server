const jwtConfig = {
    secret: process.env.APP_SECRET || 'defaultSecret1234',
    expiresIn: '7d'
}

export default jwtConfig