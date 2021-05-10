'use strict'
import express, {Express} from 'express'
import bodyParser from 'body-parser'
import config from './config'
import path from 'path'

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
        /** server app listener **/
        app.listen(PORT, () => console.log(`Server is listening port ${PORT}`))
    }
    catch (e) {
        console.log(`Server Error`, e.message)
        process.exit(1)
    }
}

/** Start API server **/
start()
    .then(() => {
        console.info(`App startup at ${(new Date()).toTimeString()}`)
    })