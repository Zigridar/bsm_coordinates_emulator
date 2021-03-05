import {
    ADD_FABRIC_OBJECT,
    CHANGE_CANVAS_DIM,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT,
    SET_OBSERVABLE
} from './actionTypes'
import {fabric} from 'fabric'

export const addObjectAction: (object: BSM) => FabricObjectAction = (object: BSM) => {
    const action: FabricObjectAction = {
        type: ADD_FABRIC_OBJECT,
        object
    }

    return action
}

export const removeObjectAction: (object: fabric.Object) => FabricObjectAction = (object: fabric.Object) => {
    const action: FabricObjectAction = {
        type: REMOVE_FABRIC_OBJECT,
        removedObject: object
    }
    return action
}

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

export const setObservableAction = (object: IObservable) => {
    const action: FabricObjectAction = {
        type: SET_OBSERVABLE,
        observable: object
    }

    return action
}