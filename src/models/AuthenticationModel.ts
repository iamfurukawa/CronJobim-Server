interface Authentication {
    user: {
        id: number,
        username: string,
        email: string
    },
    token: string
}

export default Authentication