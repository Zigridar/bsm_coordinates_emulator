import {
    ADD_STAT_POINTS,
    ADD_STAT_ROWS,
    CHANGE_ERRORS,
    DELETE_STAT_ROW,
    SET_VALID_ROW,
    UPDATE_REAL_POINT
} from "../actionTypes";

export type StatisticState = {
    statisticData: StatisticRow[]
    errors: [number, number, number]
    statisticPoints: [IPoint, IPoint][]
}

export interface AddStatRows {
    type: typeof ADD_STAT_ROWS
    statRows: StatisticRow[]
}

export interface ChangeErrors {
    type: typeof CHANGE_ERRORS
    errors: [number, number, number]
}

export interface AddStatPoints {
    type: typeof ADD_STAT_POINTS
    statPoint: [IPoint, IPoint]
}

export type RealPointUpdate = [IPoint, number]

export interface UpdateRealPointAction {
    type: typeof UPDATE_REAL_POINT
    update: RealPointUpdate
}

export type SetValid = [boolean, number]

export interface SetValidRow {
    type: typeof SET_VALID_ROW,
    valid: SetValid
}

export interface DeleteStatRow {
    type: typeof DELETE_STAT_ROW,
    index: number
}

export type StatisticAction = AddStatRows | ChangeErrors | AddStatPoints | UpdateRealPointAction | SetValidRow | DeleteStatRow

const initialStatisticState: StatisticState = {
    errors: [0, 0, 0],
    statisticData: [],
    statisticPoints: []
}

const statisticReducer = (state: StatisticState = initialStatisticState, action: StatisticAction) => {
    switch (action.type) {
        case ADD_STAT_ROWS:
            return {
                ...state,
                statisticData: [...action.statRows, ...state.statisticData]
            }
        case ADD_STAT_POINTS:
            return {
                ...state,
                statisticPoints: [...state.statisticPoints, action.statPoint]
            }
        case CHANGE_ERRORS:
            return {
                ...state,
                errors: action.errors
            }
        case UPDATE_REAL_POINT:
            const [point, index] = action.update
            state.statisticData[index].realPoint = point
            return {
                ...state,
                statisticData: [...state.statisticData]
            }
        case SET_VALID_ROW:
            const [isValid, idx] = action.valid
            state.statisticData[idx].isValid = isValid
            return {
                ...state,
                statisticData: [...state.statisticData]
            }
        case DELETE_STAT_ROW:
            return {
                ...state,
                statisticData: state.statisticData.filter((row: StatisticRow, index: number) => index !== action.index)
            }
        default:
            return state
    }
}

export default statisticReducer