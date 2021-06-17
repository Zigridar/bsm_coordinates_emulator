import express, {Router} from 'express'
import ModelBsm from '../models/ModelBsm'
import {IModelIBsm} from '../commod_types/type'

const BsmRouter: Router = Router()

/** get all bsm */
BsmRouter.get(
    '/',
    async (req: express.Request, res: express.Response) => {

        const bsm = await ModelBsm.find()

        res.json({ bsm })
    }
)

/** create or update bsm */
BsmRouter.post(
    '/',
    async (req: express.Request, res: express.Response) => {
        try {
            const clientBsms = req.body.bsm as IModelIBsm[]

            if (clientBsms) {

              for (const clientBsm of clientBsms) {
                const bsm = await ModelBsm.findOne({ imei: clientBsm.imei })
                if (bsm) {
                  bsm.imei = clientBsm.imei
                  bsm.outsideImei = clientBsm.outsideImei
                  bsm.rssi0 = clientBsm.rssi0
                  bsm.r0 = clientBsm.r0
                  bsm.object = clientBsm.object
                  await bsm.save()
                }
                else {
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

            res.json({ message: 'successfully save' })
        }
        catch (e) {
            console.error(e)
          res.json({ message: 'error' })
        }
    }
)

/** delete bsm */
BsmRouter.delete(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const clientBsms = req.body.bsm as IModelIBsm[]

      if (clientBsms) {
        await ModelBsm.deleteMany( { imei: { $in: clientBsms.map(bsm => bsm.imei)} } )
      }

      res.json({ message: 'successfully deleted' })
    }
    catch (e) {
      console.error(e)
      res.json({ message: 'error' })
    }
  }
)

export default BsmRouter