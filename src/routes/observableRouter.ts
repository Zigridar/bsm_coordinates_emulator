import express, {Router} from 'express';
import {IModelObservable} from '../commod_types/type';
import ModelObservable from '../models/ModelObservable';

const ObservableRouter: Router = Router()

/** get all observables */
ObservableRouter.get(
    '/',
    async (req: express.Request, res: express.Response) => {

        const observable = await ModelObservable.find()

        res.json({ observable })
    }
)

/** create or update observable */
ObservableRouter.post(
    '/',
    async (req: express.Request, res: express.Response) => {
        try {
          const clientObservables = req.body.observable as IModelObservable[]

          if (clientObservables) {

            for (const clientObservable of clientObservables) {
              const observable = await ModelObservable.findOne({ imei: clientObservable.imei })
              if (observable) {
                observable.imei = clientObservable.imei
                observable.fakePoint = clientObservable.fakePoint
                observable.calculatedPoint = clientObservable.calculatedPoint
                await observable.save()
              }
              else {
                const observable = new ModelObservable()
                observable.imei = clientObservable.imei
                observable.fakePoint = clientObservable.fakePoint
                observable.calculatedPoint = clientObservable.calculatedPoint
                await observable.save()
              }
            }
          }

          res.json({ message: 'successfully saved' })
        }
        catch (e) {
            console.error(e)
          res.send({ message: 'error' })
        }
    }
)

/** delete observable */
ObservableRouter.delete(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const clientObservables = req.body.observable as IModelObservable[]

      if (clientObservables) {
        await ModelObservable.deleteMany( { imei: { $in: clientObservables.map(bsm => bsm.imei)} } )
      }

      res.json({ message: 'successfully deleted' })
    }
    catch (e) {
      console.error(e)
      res.json({ message: 'error' })
    }
  }
)

export default ObservableRouter