/** get mongo url from env variable */
const getMongoURI: () => string = () => {
    const URI = process.env.MONGO_URI
    if (URI)
        return URI
    else
        throw new Error('mongodb URI isn`t provided!')
}

const config = {
    PORT: 8080,
    MONGO_URI: getMongoURI()
} as const

export default config