import {CHANGE_SELECTION, CHANGE_VPT, UPLOAD_LAYER} from '../actionTypes'

export type FabricState = {
    vptCoords: VptCoords
    selection: IDeletableFabric
    uploadLayerURL: string
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
    imgURL: string
}

export type FabricObjectAction = ChangeSelectionAction | ChangeVPTCoordsAction | UploadLayerAction

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
                uploadLayerURL: action.imgURL
            }
        default:
            return state
    }
}


export default fabricStateReducer