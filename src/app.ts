'use strict'
import express, {Express} from 'express'
import bodyParser from 'body-parser'
import config from './config'
import path from 'path'
import mongoose from 'mongoose'

const PORT = config.PORT || 8080

/** init server application **/
const app: Express = express()

/** set body-parser **/
app.use(bodyParser.json())

/** Production mode **/
if (process.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client')))

    app.get('*', (req: express.Request, res: express.Response) => {
        res.sendFile(path.join(__dirname, 'client/index.html'))
    })
}

/** Start server application **/
async function start() {
    try {
        /** db connection **/
        await mongoose.connect(config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }, (err) => {
            if (!err)
                console.info(`connect to mongo on ${config.MONGO_URI}`)
            else
                throw err
        })

        /** server app listener **/
        app.listen(PORT, () => console.log(`Server is listening port ${PORT}`))
    }
    catch (e) {
        console.error(`Server Error`, e.message)
        process.exit(1)
    }
}

/** Start API server **/
start()
    .then(() => {
        console.info(`App startup at ${(new Date()).toTimeString()}`)
    })