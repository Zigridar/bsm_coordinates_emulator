import {CHANGE_FRACTION, CHANGE_MIN_AREA, CHANGE_RANDOM_ODD} from '../actionTypes'


type RandomState = {
    randomOdd: number
    minArea: number
    fraction: number
}

interface ChangeRandomOddAction {
    type: typeof CHANGE_RANDOM_ODD
    randomOdd: number
}

interface ChangeMinAreaAction {
    type: typeof CHANGE_MIN_AREA
    minArea: number
}

interface ChangeFractionAction {
    type: typeof CHANGE_FRACTION
    fraction: number
}

type RandomAction = ChangeRandomOddAction | ChangeMinAreaAction | ChangeFractionAction

const initialRandomState: RandomState = {
    fraction: 0.002,
    minArea: 1,
    randomOdd: 3000
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
    }
}

export default randomReducer