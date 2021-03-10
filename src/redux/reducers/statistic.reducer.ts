import {ADD_STAT_POINTS, ADD_STAT_ROW, CHANGE_ERRORS} from "../actionTypes";


type StatisticState = {
    statisticData: StatisticRow[]
    errors: [number, number, number]
    statisticPoints: [IPoint, IPoint][]
}

interface AddStatRow {
    type: typeof ADD_STAT_ROW
    statRow: StatisticRow
}

interface ChangeErrors {
    type: typeof CHANGE_ERRORS
    errors: [number, number, number]
}

interface AddStatPoints {
    type: typeof ADD_STAT_POINTS
    statPoint: [IPoint, IPoint]
}

type StatisticAction = AddStatRow | ChangeErrors | AddStatPoints

const initialStatisticState: StatisticState = {
    errors: [0, 0, 0],
    statisticData: [],
    statisticPoints: []
}

const statisticReducer = (state: StatisticState = initialStatisticState, action: StatisticAction) => {
    switch (action.type) {
        case ADD_STAT_ROW:
            return {
                ...state,
                statisticData: [action.statRow, ...state.statisticData]
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
    }
}

export default statisticReducer