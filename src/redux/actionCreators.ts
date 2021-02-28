import {ADD_FABRIC_OBJECT, CHANGE_CURRENT_COORDS, REMOVE_FABRIC_OBJECT} from './actionTypes'
import {fabric} from 'fabric'

const actionCreator: (actionType: string) => (object: fabric.Object) => FabricObjectAction = (actionType: string) => {
    return (object: fabric.Object) => {
        const action: FabricObjectAction = {
            type: actionType,
            object
        }

        return action
    }
}

export const addFabricObjectAction: (object: fabric.Object) => FabricObjectAction = actionCreator(ADD_FABRIC_OBJECT)
export const removeFabricObjectAction: (object: fabric.Object) => FabricObjectAction = actionCreator(REMOVE_FABRIC_OBJECT)

export const changeCurrentCoordsAction = (coords: [number, number], object: fabric.Object) => {
    const action: FabricObjectAction = {
        type: CHANGE_CURRENT_COORDS,
        object
    }

    return action
}