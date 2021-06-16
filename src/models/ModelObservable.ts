'use strict'
import {Document, Model, model, Schema} from 'mongoose'

export interface IModelObservable {
    imei: number
    fakePoint: any
    calculatedPoint: any
}

export type DocumentObservable = Document & IModelObservable

const ObservableSchema = new Schema<DocumentObservable>({
    imei: { type: Number, required: true },
    fakePoint: { type: Object, required: true },
    calculatedPoint: { type: Object, required: true }
})

const ModelObservable: Model<DocumentObservable> = model<DocumentObservable>('Observable', ObservableSchema)

export default ModelObservable