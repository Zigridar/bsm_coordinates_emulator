import {
    ADD_FABRIC_OBJECT,
    ADD_OBSERVABLE,
    CHANGE_MODE,
    CHANGE_SELECTION,
    REMOVE_FABRIC_OBJECT,
    SET_FRACTION,
    SET_LEARNING,
    SET_MIN_TRIANGLE_AREA,
    SET_OBSERVABLE,
    SET_RANDOM_ODD,
    SET_VPT
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

export const setFractionAction = (fraction: number) => {
    const action: FabricObjectAction = {
        type: SET_FRACTION,
        numberValue: fraction
    }

    return action
}

export const setRandomOdd = (randomOdd: number) => {
    const action: FabricObjectAction = {
        type: SET_RANDOM_ODD,
        numberValue: randomOdd
    }

    return action
}

export const setMinTriangleArea = (minArea: number) => {
    const action: FabricObjectAction = {
        type: SET_MIN_TRIANGLE_AREA,
        numberValue: minArea
    }

    return action
}

export const setLearningAction = (isLearning: boolean) => {
    const action: FabricObjectAction = {
        type: SET_LEARNING,
        boolValue: isLearning
    }

    return action
}

export const setVPTAction = (vptCoords: VptCoords) => {
    const action: FabricObjectAction = {
        type: SET_VPT,
        vptCoords
    }

    return action
}

export const addObservableAction = (observable: IObservable) => {
    const action: FabricObjectAction = {
        type: ADD_OBSERVABLE,
        observable
    }

    return action
}

export const toggleModeAction = (isTest: boolean) => {
    const action: FabricObjectAction ={
        type: CHANGE_MODE,
        boolValue: isTest
    }

    return action
}