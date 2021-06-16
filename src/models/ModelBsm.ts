'use strict'
import {model, Schema, Document, Model} from 'mongoose'
import {IModelIBsm} from '../commod_types/type'

export type DocumentBsm = Document & IModelIBsm

const BsmSchema: Schema<DocumentBsm> = new Schema<DocumentBsm>({
    object: { type: Object, required: true },
    rssi0: { type: Number, required: true },
    r0: { type: Number, required: true },
    outsideImei: { type: Number, required: true },
    imei: { type: Number, required: true }
})

const ModelBsm: Model<DocumentBsm> = model<DocumentBsm>('BSM', BsmSchema)

export default ModelBsm