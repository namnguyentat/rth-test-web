// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Creators as modalActions } from 'reduxx/modalRedux'

type Props = {
  text: string,
  showLoginModal: () => void
}
const LoginPromt = (props: Props) => {
  const { text, showLoginModal } = props
  return (
    <div className="text-center">
      <button className="btn btn--text text-primary" onClick={showLoginModal}>
        {text}
      </button>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Function) => ({
  showLoginModal: () => dispatch(modalActions.showModal('LOGIN_MODAL'))
})

export default connect(null, mapDispatchToProps)(LoginPromt)
