import {CHANGE_SELECTION, CHANGE_VPT, SAVE_BACKGROUND, UPLOAD_LAYER} from '../actionTypes'
import {fabric} from 'fabric'

export type FabricState = {
    vptCoords: VptCoords
    selection: IDeletableFabric
    uploadLayerURL: fabric.Image
}

export interface ChangeVPTCoordsAction {
    type: typeof CHANGE_VPT
    vptCoords: VptCoords
}

export interface ChangeSelectionAction {
    type: typeof CHANGE_SELECTION
    selection: IDeletableFabric
}

export interface UploadLayerAction {
    type: typeof UPLOAD_LAYER,
    backgroundImage: fabric.Image
}

export interface SaveBackgroundAction {
    type: typeof SAVE_BACKGROUND
}

export type FabricObjectAction = ChangeSelectionAction | ChangeVPTCoordsAction | UploadLayerAction | SaveBackgroundAction

const initialFabricState: FabricState = {
    selection: null,
    vptCoords: null,
    uploadLayerURL: null
}

const fabricStateReducer: (state: FabricState, action: FabricObjectAction) => FabricState = (state: FabricState = initialFabricState, action: FabricObjectAction) => {
    switch (action.type) {
        case CHANGE_SELECTION:
            return {
                ...state,
                selection: action.selection
            }
        case CHANGE_VPT:
            return {
                ...state,
                vptCoords: action.vptCoords
            }
        case UPLOAD_LAYER:
            return {
                ...state,
                uploadLayerURL: action.backgroundImage
            }
        case SAVE_BACKGROUND:
            return {
                ...state,
                uploadLayerURL: null
            }
        default:
            return state
    }
}


export default fabricStateReducer