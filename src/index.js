// @flow

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'reduxx'
import App from './App'

// Setup and Initalize
import 'setup/timezone'
import 'setup/language'
import 'setup/social'
import 'lib/polyfill_local_storage'


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
