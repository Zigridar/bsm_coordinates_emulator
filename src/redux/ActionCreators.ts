import {
    AddBSMAction,
    AddBSMsAction,
    AddObservableAction,
    AddObservablesAction,
    DeleteBSMAction,
    SetObservableCoordsAction
} from './reducers/lps.reducer'
import {
    ADD_BSM,
    ADD_BSMS,
    ADD_OBSERVABLE,
    ADD_OBSERVABLES,
    ADD_RANDOM_ODDS,
    ADD_STAT_ROWS,
    CHANGE_FRACTION,
    CHANGE_MIN_AREA,
    CHANGE_MODE,
    CHANGE_RANDOM_ODD,
    CHANGE_SELECTION,
    CHANGE_VPT,
    DELETE_BSM,
    SET_LEARNING,
    SET_OBSERVABLE_COORDS,
    UPDATE_REAL_POINT
} from './actionTypes'
import {
    AddRandomOdds,
    ChangeFractionAction,
    ChangeLearningAction,
    ChangeMinAreaAction,
    ChangeRandomOddAction
} from "./reducers/random.reducer"
import {ChangeModeAction} from "./reducers/test.reducer"
import {fabric} from "fabric"
import {AddStatRows, RealPointUpdate, UpdateRealPointAction} from "./reducers/statistic.reducer"
import {ChangeSelectionAction, ChangeVPTCoordsAction} from "./reducers/fabric.reducer"

export const addBsm = (bsm: BSM) => {
    const action: AddBSMAction = {
        type: ADD_BSM,
        bsm
    }
    return action
}

export const addBsms = (bsms: BSM[]) => {
    const action: AddBSMsAction = {
        type: ADD_BSMS,
        bsms
    }
    return action
}

export const deleteBSM = (deletable: fabric.Object) => {
    const action: DeleteBSMAction = {
        type: DELETE_BSM,
        deletable
    }
    return action
}

export const changeFraction = (fraction: number) => {
    const action: ChangeFractionAction = {
        type: CHANGE_FRACTION,
        fraction
    }
    return action
}

export const changeRandomOdd = (randomOdd: number) => {
    const action: ChangeRandomOddAction = {
        type: CHANGE_RANDOM_ODD,
        randomOdd
    }
    return action
}

export const changeMinArea = (minArea: number) => {
    const action: ChangeMinAreaAction = {
        type: CHANGE_MIN_AREA,
        minArea
    }
    return action
}

export const addRandomOdds = (randomOdds: RandomOddStorage) => {
    const action: AddRandomOdds = {
        type: ADD_RANDOM_ODDS,
        randomOdds
    }
    return action
}

export const changeMode = (isTesting: boolean) => {
    const action: ChangeModeAction = {
        type: CHANGE_MODE,
        isTesting
    }
    return action
}

export const addObservable = (observable: IObservable) => {
    const action: AddObservableAction = {
        type: ADD_OBSERVABLE,
        observable
    }
    return action
}

export const addObservables = (observables: IObservable[]) => {
    const action: AddObservablesAction = {
        type: ADD_OBSERVABLES,
        observables
    }
    return action
}

export const addStatRows = (statRows: StatisticRow[]) => {
    const action: AddStatRows = {
        type: ADD_STAT_ROWS,
        statRows
    }
    return action
}

export const updateRealPoint = (update: RealPointUpdate) => {
    const action: UpdateRealPointAction = {
        type: UPDATE_REAL_POINT,
        update
    }
    return action
}

export const changeLearningMode = (isLearning: boolean) => {
    const action: ChangeLearningAction = {
        type: SET_LEARNING,
        isLearning
    }
    return action
}

export const changeSelection = (selection: fabric.Object) => {
    const action: ChangeSelectionAction = {
     type: CHANGE_SELECTION,
     selection
    }
    return action
}

export const changeVPT = (vptCoords: VptCoords) => {
    const action: ChangeVPTCoordsAction = {
        type: CHANGE_VPT,
        vptCoords
    }
    return action
}

export const setObservableCoords = (statRows: StatisticRow[]) => {
    const action: SetObservableCoordsAction = {
        type: SET_OBSERVABLE_COORDS,
        statRows
    }
    return action
}