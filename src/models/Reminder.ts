import IgnoreType from "../utils/IgnoreType"
import EveryType from "../utils/EveryType"

interface Reminder {
    id: number
    message: string
    webhook: {
        id: number,
        alias: string,
        webhook: string
    }
    startDate: Date
    active: boolean
    repeat: EveryType
    ignore: IgnoreType
    endDate: Date
    nextExecution: Date
}

export default Reminder