// @flow

import { createActions, createReducer } from 'reduxsauce'

const INITIAL_STATE = { visibleModal: null }

export const { Types, Creators } = createActions(
  {
    showModal: ['visibleModal'],
    hideModal: null
  },
  {}
)

const showModal = (state = INITIAL_STATE, action) => {
  const { visibleModal } = action
  return { ...state, visibleModal }
}

const hideModal = (state = INITIAL_STATE, action) => {
  return { ...state, visibleModal: '' }
}

export const HANDLERS = {
  [Types.SHOW_MODAL]: showModal,
  [Types.HIDE_MODAL]: hideModal
}

export default createReducer(INITIAL_STATE, HANDLERS)
