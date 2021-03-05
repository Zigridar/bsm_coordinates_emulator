import {
    ADD_FABRIC_OBJECT,
    CHANGE_CANVAS_DIM,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT, SET_FRACTION, SET_MIN_TRIANGLE_AREA,
    SET_OBSERVABLE, SET_RANDOM_ODD
} from './actionTypes'
import {calcAndDrawFantom, calcHypotenuse, nonZeroCoords, vectorModule} from '../utils'
import {fabric} from 'fabric'
import {IEvent} from 'fabric/fabric-impl'
import store from './store'

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
        store.getState().bsmList.forEach((bsm: BSM) => {
            const center = bsm.getCoords()
            const module = vectorModule(center, nonZeroCoords(e.pointer))
            const hyp = store.getState().hypotenuse

            const relation = module > hyp ? 0 : (module / hyp)

            const rssi = -relation * 50 - 50

            bsm.setRssi(rssi)
            calcAndDrawFantom(
                store.getState().fantomPoint,
                store.getState().bsmList,
                store.getState().randomOdd,
                store.getState().minTriangleArea,
                store.getState().fraction
            )
        })
    })

    const newObservable: IObservable = {
        object: observableObject
    }

    return newObservable
}

const initialState: FabricState = {
    fantomPoint: initFantomPoint(),
    observable: initObservable(),
    bsmList: [],
    hypotenuse: 0,
    canvasDim: [0, 0],
    selection: null,
    randomOdd: 1000,
    minTriangleArea: 1,
    fraction: 0.005
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
        default:
            return  state
    }
}

export default reducer