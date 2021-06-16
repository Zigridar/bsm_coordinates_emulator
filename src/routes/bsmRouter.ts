import express, {Router} from 'express'
import ModelBsm from '../models/ModelBsm'
import {IModelIBsm} from '../commod_types/type'

const BsmRouter: Router = Router()

BsmRouter.get(
    '/',
    async (req: express.Request, res: express.Response) => {

        const bsm = await ModelBsm.find()

        res.json({ bsm })
    }
)

BsmRouter.post(
    '/',
    async (req: express.Request, res: express.Response) => {
        try {
            const clientBsms = req.body.bsm

            //todo crutch
            await ModelBsm.deleteMany()

            if (clientBsms) {
                const bsms = clientBsms as IModelIBsm[]

                for (const clientBsm of bsms) {
                    const bsm = new ModelBsm()
                    bsm.imei = clientBsm.imei
                    bsm.outsideImei = clientBsm.outsideImei
                    bsm.rssi0 = clientBsm.rssi0
                    bsm.r0 = clientBsm.r0
                    bsm.object = clientBsm.object
                    await bsm.save()
                }
            }

        }
        catch (e) {
            console.error(e)
        }
        finally {
            res.end()
        }
    }
)

export default BsmRouter