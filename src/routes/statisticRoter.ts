import express, {Router} from 'express';
import {IModelStatistic} from '../commod_types/type';
import ModelStatistic from '../models/ModelStatistic';

const StatisticRouter: Router = Router()

StatisticRouter.get(
  '/',
  async (req: express.Request, res: express.Response) => {

    const statistics = await ModelStatistic.find()

    res.json({ statistics })
  }
)

StatisticRouter.post(
  '/',
  async (req: express.Request, res: express.Response) => {
    try {
      const clientStatistics = req.body.statistics

      await ModelStatistic.deleteMany()

      if (clientStatistics) {
        const statistics = clientStatistics as IModelStatistic[]

        for (const clientStatistic of statistics) {
          const statistic = new ModelStatistic()
          statistic.isValid = clientStatistics.isValid
          statistic.observableImei = clientStatistics.observableImei
          statistic.calcPoint = clientStatistic.calcPoint
          statistic.randomPoint = clientStatistic.randomPoint
          statistic.realPoint = clientStatistic.realPoint
          await statistic.save()
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

export default StatisticRouter