/** get source from env variable with assert if not provided */
const assertGet: <T>(source: string) => T = <T>(source: string) => {
    const data = process.env[source] as any as T
    if (data)
        return data
    else
        throw new Error(`${source} isn't provided!`)
}

const config = {
    PORT: assertGet<number>('PORT'),
    MONGO_URI: assertGet<string>('MONGO_URI'),
    backupDir: assertGet<string>('BACK_UP_DIR')
} as const

export default config