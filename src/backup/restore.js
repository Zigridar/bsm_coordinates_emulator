import restore  from 'mongodb-restore'
import config from '../config'

const options = (archive, path) => ({
    uri: config.MONGO_URI,
    root: path,
    tar: archive,
    callback: (e) => {
        if (e)
            console.error(e)
        else
            console.log(`database successfully restored`)
    }
})

restore(options(process.env.archive, process.env.path))