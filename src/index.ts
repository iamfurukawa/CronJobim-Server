import 'dotenv/config'
import 'reflect-metadata'
import Api from './server'

Api.listen(process.env.APP_PORT, () => console.log('Server started.'))
