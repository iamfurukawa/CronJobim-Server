import chalk from 'chalk'
import fs from 'fs'
import { Request, Response, NextFunction } from 'express'

/*
    References:
        https://codesource.io/creating-a-logging-middleware-in-expressjs/
        https://github.com/Dunebook/ExpressjsMiddlewarelogging/blob/master/server.js
*/

const getActualRequestDurationInMilliseconds = (start: [number, number] | undefined) => {
    const NS_PER_SEC = 1e9 // constant to convert to nanoseconds
    const NS_TO_MS = 1e6 // constant to convert to milliseconds
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

const Logger = (req: Request, res: Response, next: NextFunction) => {
    const current_datetime = new Date()
    const method = req.method
    const url = req.url
    const status = res.statusCode

    const formatted_date =
        (current_datetime.getMonth() + 1) + "/" +
        current_datetime.getDate() + "/" +
        current_datetime.getFullYear() + " " +

        current_datetime.getHours() + ":" +
        current_datetime.getMinutes() + ":" +
        current_datetime.getSeconds()

    const start = process.hrtime()
    const durationInMilliseconds = getActualRequestDurationInMilliseconds(start)

    const log = `[${chalk.blue(formatted_date)}] ${method}:${url} ${status} ${chalk.green(durationInMilliseconds.toLocaleString() + "ms")}`

    console.log(log)

    fs.appendFile("request_logs.txt", log + "\n", err => {
        if (err) {
            console.log(err)
        }
    })

    next()
}

export default Logger