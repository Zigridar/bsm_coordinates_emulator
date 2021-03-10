import {
    ADD_FABRIC_OBJECT,
    ADD_OBSERVABLE, ADD_STAT_ROW, CHANGE_MODE,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT,
    CHANGE_FRACTION,
    SET_LEARNING,
    CHANGE_MIN_AREA,
    SET_OBSERVABLE,
    CHANGE_RANDOM_ODD,
    SET_VPT, UPDATE_REAL_POINT
} from './actionTypes'
import {initTestObservable} from '../fabricUtils'
import {setCoords} from '../utils'

const initialState: FabricState = {
    statisticData: [],
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
        case CHANGE_FRACTION:
            return {
                ...state,
                fraction: action.numberValue
            }
        case CHANGE_MIN_AREA:
            return {
                ...state,
                minTriangleArea: action.numberValue
            }
        case CHANGE_RANDOM_ODD:
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
        case ADD_STAT_ROW:
            action.statRows.forEach(row => {
                const observable = state.observables.find(obs => obs.imei === row.observableImei)
                setCoords(observable.fakePoint, row.randomPoint)
                setCoords(observable.calculatedPoint, row.calcPoint)
            })
            return {
                ...state,
                statisticData: [...action.statRows, ...state.statisticData]
            }
        case UPDATE_REAL_POINT:
            debugger
            state.statisticData[action.numberValue].realPoint = action.realPoint
            return {
                ...state,
                statisticData: [...state.statisticData]
            }
        default:
            return  state
    }
}

export default reducer