import express, {Router} from 'express'
import ModelObservable, {IModelObservable} from '../models/ModelObservable'

const ObservableRouter: Router = Router()

ObservableRouter.get(
    '/',
    async (req: express.Request, res: express.Response) => {

        const observable = await ModelObservable.find()

        res.json({ observable })
    }
)

ObservableRouter.post(
    '/',
    async (req: express.Request, res: express.Response) => {
        try {
            const clientObservables = req.body.observable

            //todo crutch
            await ModelObservable.deleteMany()

            if (clientObservables) {
                const observables = clientObservables as IModelObservable[]

                for (const clientObservable of observables) {
                    const observable = new ModelObservable()
                    observable.imei = clientObservable.imei
                    observable.fakePoint = clientObservable.fakePoint
                    observable.calculatedPoint = clientObservable.calculatedPoint
                    await observable.save()
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

export default ObservableRouter