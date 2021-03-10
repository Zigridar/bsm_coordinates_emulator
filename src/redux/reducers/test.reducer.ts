import {CHANGE_MODE} from '../actionTypes'
import {initTestObservable} from '../../fabricUtils'

export type TestState = {
    isTesting: boolean
    testObservable: IObservable
}

export interface ChangeModeAction {
    type: typeof CHANGE_MODE
    isTesting: boolean
}

export type TestAction = ChangeModeAction

const initialTestState: TestState = {
    isTesting: true,
    testObservable: initTestObservable(-1)
}

const testReducer: (state: TestState, action: TestAction) => TestState = (state: TestState = initialTestState, action: TestAction) => {
    switch (action.type) {
        case CHANGE_MODE:
            return {
                ...state,
                isTesting: action.isTesting
            }
        default:
            return state
    }
}

export default testReducer