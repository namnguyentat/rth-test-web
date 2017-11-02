// @flow

import store from 'reduxx'
import { Creators as modalActions } from 'reduxx/modalRedux'

export const isUserLogined = () => {
  return !!localStorage.getItem('current_user_id')
}

export const showLoginModal = () => {
  store.dispatch(modalActions.showModal('LOGIN_MODAL'))
  return false
}
