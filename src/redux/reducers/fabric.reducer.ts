import {CHANGE_SELECTION, CHANGE_VPT} from '../actionTypes'

export type FabricState = {
    vptCoords: VptCoords
    selection: IDeletableFabric
}

export interface ChangeVPTCoordsAction {
    type: typeof CHANGE_VPT
    vptCoords: VptCoords
}

export interface ChangeSelectionAction {
    type: typeof CHANGE_SELECTION
    selection: IDeletableFabric
}

export type FabricObjectAction = ChangeSelectionAction | ChangeVPTCoordsAction

const initialFabricState: FabricState = {
    selection: null,
    vptCoords: null
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
        default:
            return state
    }
}


export default fabricStateReducer