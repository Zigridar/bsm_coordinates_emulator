import {ADD_FABRIC_OBJECT, REMOVE_FABRIC_OBJECT} from './actionTypes'

const initialState: FabricState = {
    bsmList: [],
    currentCoords: [0, 0]
}

const reducer = (state: FabricState = initialState, action: FabricObjectAction): FabricState => {
    switch (action.type) {
        case ADD_FABRIC_OBJECT:
            return {
                ...state,
                bsmList: state.bsmList.concat(action.object)
            }
        case REMOVE_FABRIC_OBJECT:
            return {
                ...state,
                bsmList: state.bsmList.filter(item => item !== action.object)
            }
        default:
            return  state
    }
}

export default reducer