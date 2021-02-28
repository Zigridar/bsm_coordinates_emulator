import {ADD_FABRIC_OBJECT, CHANGE_CANVAS_DIM, CHANGE_SELECTION, MOVE_EVENT, REMOVE_FABRIC_OBJECT} from './actionTypes'

const initialState: FabricState = {
    bsmList: [],
    canvasDim: [0, 0],
    selection: null
}

const reducer = (state: FabricState = initialState, action: FabricObjectAction): FabricState => {
    switch (action.type) {
        case ADD_FABRIC_OBJECT:
            return {
                ...state,
                bsmList:state.bsmList.concat(action.object),
            }
        case REMOVE_FABRIC_OBJECT:
            return {
                ...state,
                bsmList: state.bsmList.filter((item: BSM) => item.object !== action.object.object)
            }
        case CHANGE_CANVAS_DIM:
            return {
                ...state,
                canvasDim: action.canvasDim
            }
        case CHANGE_SELECTION:
            return {
                ...state,
                selection: action.selection
            }
        default:
            return  state
    }
}

export default reducer