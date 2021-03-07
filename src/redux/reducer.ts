import {
    ADD_FABRIC_OBJECT,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT,
    SET_FRACTION,
    SET_LEARNING,
    SET_MIN_TRIANGLE_AREA,
    SET_OBSERVABLE,
    SET_RANDOM_ODD,
    SET_VPT
} from './actionTypes'
import {calcAndDrawFantom, calcErrors, setBsmRssi} from '../utils'
import {fabric} from 'fabric'
import {IEvent} from 'fabric/fabric-impl'
import store from './store'
import {STATIST_POINT_COUNT} from "../constants";

const initFantomPoint: () => fabric.Object = () => {
    const pseudoPoint = new fabric.Circle({
        radius: 10,
        fill: '#ff00d5',
        selectable: false
    })

    return pseudoPoint
}

const initObservable = () => {
    const observableObject = new fabric.Circle({
        radius: 20,
        fill: '#3416ff',
        hasControls: false,
        selectable: true,
        hasBorders: false
    })

    observableObject.on('moving', (e: IEvent) => {

        setBsmRssi(
            store.getState().bsmList,
            e.pointer
        )

        if (store.getState().bsmList.length > 0) {
            const calculatedPoint = calcAndDrawFantom(
                store.getState().fantomPoint,
                store.getState().bsmList,
                store.getState().randomOdd,
                store.getState().minTriangleArea,
                store.getState().fraction
            )
            const pointArr = store.getState().statisticPoints
            if (pointArr.length < STATIST_POINT_COUNT)
                pointArr.push([e.pointer, calculatedPoint])
            else {
                store.getState().errors = calcErrors(pointArr)
                store.getState().statisticPoints = []
            }
        }
        else
            console.log('Нет БСМ')
    })

    const newObservable: IObservable = {
        object: observableObject
    }

    return newObservable
}

const initialState: FabricState = {
    errors: [0, 0, 0],
    statisticPoints: [],
    vptCoords: undefined,
    fantomPoint: initFantomPoint(),
    observable: initObservable(),
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
                observable: action.observable
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
            state.bsmList.forEach((bsm: BSM) => bsm.setSelectable(!action.isLearning))
            return {
                ...state,
                isLearning: action.isLearning
            }

        case SET_VPT:
            return {
                ...state,
                vptCoords: action.vptCoords,
            }
        default:
            return  state
    }
}

export default reducer