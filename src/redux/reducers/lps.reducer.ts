import {ADD_BSM, ADD_OBSERVABLE, DELETE_BSM} from "../actionTypes"

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

export type LpsStateAction = AddBSMAction | DeleteBSMAction | AddObservableAction

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
        default:
            return state
    }
}

export default lpsReducer