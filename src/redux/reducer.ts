import {
    ADD_FABRIC_OBJECT,
    ADD_OBSERVABLE, CHANGE_MODE,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT,
    SET_FRACTION,
    SET_LEARNING,
    SET_MIN_TRIANGLE_AREA,
    SET_OBSERVABLE,
    SET_RANDOM_ODD,
    SET_VPT
} from './actionTypes'
import {initTestObservable} from '../fabricUtils'

const initialState: FabricState = {
    isTest: true,
    observables: [],
    errors: [0, 0, 0],
    statisticPoints: [],
    vptCoords: undefined,
    testObservable: initTestObservable(-1),
    bsmList: [],
    selection: null,
    randomOdd: 1000,
    minTriangleArea: 1,
    fraction: 0.005,
    isLearning: false
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
                bsmList: state.bsmList.filter((item: BSM) => {
                    const check = item.object !== action.removedObject
                    if (!check)
                        item.object.forDelete = true
                    return check
                })
            }
        case CHANGE_SELECTION:
            return {
                ...state,
                selection: action.selection
            }
        case SET_OBSERVABLE:
            return  {
                ...state,
                testObservable: action.observable
            }
        case SET_FRACTION:
            return {
                ...state,
                fraction: action.numberValue
            }
        case SET_MIN_TRIANGLE_AREA:
            return {
                ...state,
                minTriangleArea: action.numberValue
            }
        case SET_RANDOM_ODD:
            return {
                ...state,
                randomOdd: action.numberValue
            }
        case SET_LEARNING:
            state.bsmList.forEach((bsm: BSM) => bsm.setSelectable(!action.boolValue))
            return {
                ...state,
                isLearning: action.boolValue
            }

        case SET_VPT:
            return {
                ...state,
                vptCoords: action.vptCoords,
            }
        case ADD_OBSERVABLE:
            return {
                ...state,
                observables: [...state.observables, action.observable]
            }
        case CHANGE_MODE:
            return {
                ...state,
                isTest: action.boolValue
            }
        default:
            return  state
    }
}

export default reducer