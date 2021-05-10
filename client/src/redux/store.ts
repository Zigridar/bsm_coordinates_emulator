import {combineReducers, createStore} from 'redux'
import randomReducer from './reducers/random.reducer'
import statisticReducer from './reducers/statistic.reducer'
import fabricStateReducer from './reducers/fabric.reducer'
import lpsReducer from './reducers/lps.reducer'
import testReducer from './reducers/test.reducer'

const rootReducer = combineReducers({
    random: randomReducer,
    statistic: statisticReducer,
    fabric: fabricStateReducer,
    lps: lpsReducer,
    test: testReducer
})

export type RootState = ReturnType<typeof rootReducer>

const store = createStore(rootReducer)

export default store