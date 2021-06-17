import restore  from 'mongodb-restore'
import config from '../config'

const options = (dbname, archive) => ({
    uri: config.MONGO_URI,
    root: __dirname,
    tar: archive,
    callback: (e) => {
        if (e)
            console.error(e)
        else
            console.log(`database ${dbname} successfully restored`)
    }
})

restore(options(process.env.dbname, process.env.archive))