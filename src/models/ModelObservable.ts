'use strict'
import {Document, Model, model, Schema} from 'mongoose'
import {IModelObservable} from '../commod_types/type';

type DocumentObservable = Document & IModelObservable

/** Observable document schema */
const ObservableSchema = new Schema<DocumentObservable>({
    /** IMEI */
    imei: { type: Number, required: true, unique: true },
    /** fabric serialized graphic object */
    fakePoint: { type: Object, required: true },
    /** fabric serialized graphic object */
    calculatedPoint: { type: Object, required: true }
})

/** creates model */
const ModelObservable: Model<DocumentObservable> = model<DocumentObservable>('Observable', ObservableSchema)

export default ModelObservable