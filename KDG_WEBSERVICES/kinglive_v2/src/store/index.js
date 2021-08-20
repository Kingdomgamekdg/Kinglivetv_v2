import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'

const store = createStore(reducers, applyMiddleware(thunk))
store.subscribe(() => {
  // console.log({ store: store.getState() })
})

export default store
