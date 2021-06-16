'use strict';
import {Document, model, Schema} from 'mongoose';
import {IModelStatistic} from '../commod_types/type';

export type DocumentStatistic = Document & IModelStatistic

const StatisticSchema = new Schema<DocumentStatistic>({
  isValid: { type: Boolean, default: true },
  observableImei: { type: Number },
  calcPoint: { type: Object },
  randomPoint: { type: Object },
  realPoint: { type: Object }
})

const ModelStatistic = model<DocumentStatistic>('Statistic', StatisticSchema)

export default ModelStatistic