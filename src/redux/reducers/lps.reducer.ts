import {ADD_BSM, ADD_BSMS, ADD_OBSERVABLE, ADD_OBSERVABLES, DELETE_BSM, SET_OBSERVABLE_COORDS} from '../actionTypes'
import {setCoords} from "../../utils";

export type LpsState = {
    bsmList: BSM[]
    observables: IObservable[]
}

export interface AddBSMAction {
    type: typeof ADD_BSM
    bsm: BSM
}

export interface DeleteBSMAction {
    type: typeof DELETE_BSM
    deletable: IDeletableFabric
}

export interface AddObservableAction {
    type: typeof ADD_OBSERVABLE
    observable: IObservable
}

export interface AddObservablesAction {
    type: typeof ADD_OBSERVABLES,
    observables: IObservable[]
}

export interface AddBSMsAction {
    type: typeof ADD_BSMS,
    bsms: BSM[]
}

export interface SetObservableCoordsAction {
    type: typeof SET_OBSERVABLE_COORDS,
    statRows: StatisticRow[]
}

export type LpsStateAction = AddBSMAction | DeleteBSMAction | AddObservableAction | AddBSMsAction | AddObservablesAction | SetObservableCoordsAction

const initialState: LpsState = {
    bsmList: [],
    observables: []
}

const lpsReducer: (state: LpsState, action: LpsStateAction) => LpsState = (state: LpsState = initialState, action: LpsStateAction) => {
    switch (action.type) {
        case ADD_BSM:
            return {
                ...state,
                bsmList: [...state.bsmList, action.bsm]
            }
        case DELETE_BSM:
            return {
                ...state,
                bsmList: state.bsmList.filter(bsm => {
                    const check = bsm.object !== action.deletable
                    if (!check)
                        bsm.object.forDelete = true
                    return check
                })
            }
        case ADD_OBSERVABLE:
            return {
                ...state,
                observables: [...state.observables, action.observable]
            }
        case ADD_BSMS:
            return {
                ...state,
                bsmList: [...state.bsmList, ...action.bsms]
            }
        case ADD_OBSERVABLES:
            return {
                ...state,
                observables: [...state.observables, ...action.observables]
            }
        case SET_OBSERVABLE_COORDS:
            action.statRows.forEach((statRow: StatisticRow) => {
                const obs = state.observables.find(obs => obs.imei === statRow.observableImei)
                try {
                    setCoords(obs.calculatedPoint, statRow.calcPoint)
                    setCoords(obs.fakePoint, statRow.randomPoint)
                }
                catch (e) {
                    console.error(e)
                }
            })
            return {
                ...state,
                observables: [...state.observables]
            }
        default:
            return state
    }
}

export default lpsReducer