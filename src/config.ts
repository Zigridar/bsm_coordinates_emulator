/** get mongo url from env variable */
const getMongoURI: () => string = () => {
    const URI = process.env.MONGO_URI
    if (URI)
        return URI
    else
        throw new Error('mongodb URI isn`t provided!')
}

/** get app port from env variable */
const getAppPort = () => {
    const PORT = process.env.PORT
    if (PORT)
        return PORT
    else
        throw new Error('App PORT isn`t provided!')
}

const config = {
    PORT: getAppPort(),
    MONGO_URI: getMongoURI()
} as const

export default config