import connectionOptions from "../configurations/ormconfig"
import { createConnection } from "typeorm"

class Connection {
    connection() {
        return createConnection(connectionOptions)
    }
}

export default new Connection().connection()