import {ADD_RANDOM_ODDS, CHANGE_FRACTION, CHANGE_MIN_AREA, CHANGE_RANDOM_ODD, SET_LEARNING} from '../actionTypes'


export type RandomState = {
    randomOdd: number
    minArea: number
    fraction: number
    isLearning: boolean
}

export interface ChangeRandomOddAction {
    type: typeof CHANGE_RANDOM_ODD
    randomOdd: number
}

export interface ChangeMinAreaAction {
    type: typeof CHANGE_MIN_AREA
    minArea: number
}

export interface ChangeFractionAction {
    type: typeof CHANGE_FRACTION
    fraction: number
}

export interface ChangeLearningAction {
    type: typeof SET_LEARNING,
    isLearning: boolean
}

export interface AddRandomOdds {
    type: typeof ADD_RANDOM_ODDS,
    randomOdds: RandomOddStorage
}

export type RandomAction = ChangeRandomOddAction | ChangeMinAreaAction | ChangeFractionAction | ChangeLearningAction | AddRandomOdds

const initialRandomState: RandomState = {
    fraction: 0.002,
    minArea: 1,
    randomOdd: 3000,
    isLearning: false
}

const randomReducer: (state: RandomState, action: RandomAction) => RandomState = (state: RandomState = initialRandomState, action: RandomAction) => {
    switch (action.type) {
        case CHANGE_RANDOM_ODD:
            return {
                ...state,
                randomOdd: action.randomOdd
            }
        case CHANGE_FRACTION:
            return {
                ...state,
                fraction: action.fraction
            }
        case CHANGE_MIN_AREA:
            return {
                ...state,
                minArea: action.minArea
            }
        case SET_LEARNING:
            return {
                ...state,
                isLearning: action.isLearning
            }
        case ADD_RANDOM_ODDS:
            return {
                ...state,
                randomOdd: action.randomOdds.randomOdd,
                fraction: action.randomOdds.fraction,
                minArea: action.randomOdds.minArea
            }
        default:
            return state
    }
}

export default randomReducer