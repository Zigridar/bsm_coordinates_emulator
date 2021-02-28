import {ADD_FABRIC_OBJECT, CHANGE_CANVAS_DIM, CHANGE_SELECTION, REMOVE_FABRIC_OBJECT} from './actionTypes'
import {fabric} from 'fabric'

const actionCreator: (actionType: string) => (object: BSM) => FabricObjectAction = (actionType: string) => {
    return (object: BSM) => {
        const action: FabricObjectAction = {
            type: actionType,
            object
        }

        return action
    }
}

export const addObjectAction: (object: BSM) => FabricObjectAction = actionCreator(ADD_FABRIC_OBJECT)
export const removeObjectAction: (object: BSM) => FabricObjectAction = actionCreator(REMOVE_FABRIC_OBJECT)

export const changeCanvasDimAction = (canvasDim: [number, number]) => {
    const action: FabricObjectAction = {
        type: CHANGE_CANVAS_DIM,
        canvasDim
    }

    return action
}

export const changeSelectionAction = (object: fabric.Object) => {
    const action: FabricObjectAction = {
        type: CHANGE_SELECTION,
        selection: object
    }

    return action
}