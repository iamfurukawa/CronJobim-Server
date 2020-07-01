interface Webhook {
    id: number
    alias: string
    webhook: string
    owner: {
        id: number,
        username: string
    } 
}

export default Webhook