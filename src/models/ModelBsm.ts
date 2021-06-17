'use strict'
import {model, Schema, Document, Model} from 'mongoose'
import {IModelIBsm} from '../commod_types/type'

type DocumentBsm = Document & IModelIBsm

/** Document schema of BSM model */
const BsmSchema: Schema<DocumentBsm> = new Schema<DocumentBsm>({
    /** fabric js graohic object */
    object: { type: Object, required: true },
    /** rssi0 - initial value */
    rssi0: { type: Number, required: true },
    /** distance of initial value */
    r0: { type: Number, required: true },
    /** imei of the outside bsm block */
    outsideImei: { type: Number, required: true },
    /** unique IMEI */
    imei: { type: Number, required: true, unique: true }
})

/** creates model */
const ModelBsm: Model<DocumentBsm> = model<DocumentBsm>('BSM', BsmSchema)

export default ModelBsm