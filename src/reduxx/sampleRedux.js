// @flow

import { createActions, createReducer } from 'reduxsauce'

// Initial state
const INITIAL_STATE = { name: '', password: '' }

// Types & Actions
export const { Types, Creators } = createActions(
  {
    loginRequest: ['name', 'password'],
    loginSuccess: ['name'],
    loginFailure: ['error'],
    requestWithDefaultValues: { name: 'guest', password: null },
    logout: null
  },
  {}
)

// Reducers
export const loginRequest = (
  state: { name: string, password: string } = INITIAL_STATE,
  action: { name: string, password: string }
) => ({
  ...state,
  name: action.name,
  password: action.password
})

export const HANDLERS = {
  [Types.LOGIN_REQUEST]: loginRequest
  // [Types.LOGIN_SUCCESS]: Creators.loginSuccess,
  // [Types.LOGIN_FAILURE]: Creators.loginFailure,
  // [Types.REQUEST_WITH_DEFAULT_VALUES]: Creators.requestWithDefaultValues,
  // [Types.LOGOUT]: Creators.logout
}

export default createReducer(INITIAL_STATE, HANDLERS)
