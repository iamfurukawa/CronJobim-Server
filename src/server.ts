import express, { Express } from 'express'
import routes from './routes'
import connection from './database'

class Api {

    server: Express

    constructor() {
        this.server = express()
        this.initializeMiddlewares()
        this.initializeRoutes()
        this.initializeConnection()
    }

    private initializeMiddlewares() {
        this.server.use(express.json())
    }

    private initializeRoutes() {
        this.server.use(routes)
    }

    private async initializeConnection() {
        await connection
    }
}

export default new Api().server
