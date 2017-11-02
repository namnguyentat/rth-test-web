// @flow

import { combineReducers, createStore } from 'redux'
import sampleRedux from './sampleRedux'
import modalRedux from './modalRedux'
import { reducer as formReducer } from 'redux-form'

const rootReducer = combineReducers({
  example: sampleRedux,
  modal: modalRedux,
  form: formReducer
})

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

export default store
