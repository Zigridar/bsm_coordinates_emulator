import {
    ADD_FABRIC_OBJECT,
    CHANGE_CANVAS_DIM,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT, SET_COLORS,
    SET_OBSERVABLE
} from './actionTypes'
import {calcHypotenuse, setColorByMaxRssi} from '../utils'

const initialState: FabricState = {
    observable: null,
    bsmList: [],
    hypotenuse: 0,
    canvasDim: [0, 0],
    selection: null,
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
            const hypotenuse = calcHypotenuse(...action.canvasDim)
            return {
                ...state,
                canvasDim: action.canvasDim,
                hypotenuse
            }
        case CHANGE_SELECTION:
            return {
                ...state,
                selection: action.selection
            }
        case SET_OBSERVABLE:
            return  {
                ...state,
                observable: action.observable
            }
        case SET_COLORS:
            const modifiedBsmList = setColorByMaxRssi(state.bsmList)
            return {
                ...state,
                bsmList: modifiedBsmList
            }
        default:
            return  state
    }
}

export default reducer