'use strict';
import {Document, model, Schema} from 'mongoose';
import {IModelStatistic} from '../commod_types/type';

type DocumentStatistic = Document & IModelStatistic

const StatisticSchema = new Schema<DocumentStatistic>({
  /** is valid stat data */
  isValid: { type: Boolean, default: true },
  /** reference to observable */
  observableImei: { type: Number, required: true },
  /** fabric graphic object */
  calcPoint: { type: Object },
  /** fabric graphic object */
  randomPoint: { type: Object },
  /** fabric graphic object */
  realPoint: { type: Object }
})

/** creates model */
const ModelStatistic = model<DocumentStatistic>('Statistic', StatisticSchema)

export default ModelStatistic