import {createStore, Store} from 'redux'
import reducer from './reducer'

const store: Store<FabricState, FabricObjectAction> = createStore(reducer)

export default store