import axios from 'axios'

class SenderMessage {
    async send(message : object, webhookUrl : string) {
        const config = {
            headers: { 'Content-Type': 'application/json; charset=UTF-8' }
        }

        try {
            await axios.post(webhookUrl, message, config)
            return true    
        } catch (error) {
            return false            
        }
    }
}

export default SenderMessage