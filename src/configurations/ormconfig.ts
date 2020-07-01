import { resolve } from 'path'
import { ConnectionOptions, DatabaseType } from 'typeorm'

const connectionOptions: ConnectionOptions = {
  "type": process.env.TYPEORM_CONNECTION as DatabaseType,
  "host": process.env.TYPEORM_HOST,
  "port": Number(process.env.TYPEORM_PORT),
  "username": process.env.TYPEORM_USERNAME,
  "password": process.env.TYPEORM_PASSWORD,
  "database": process.env.TYPEORM_DATABASE,
  "entities": [
    resolve(__dirname, '..', 'entities', '*.ts')
  ],
  "migrations" : [
    resolve(__dirname, '..', 'database', 'migrations', '*.ts')
  ],
  "synchronize": true,
  "logging": true,
  "dropSchema": true
} as ConnectionOptions

export default connectionOptions