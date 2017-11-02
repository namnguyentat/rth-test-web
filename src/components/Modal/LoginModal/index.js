// @flow

import React, { Component } from 'react'
import { Creators as modalActions } from 'reduxx/modalRedux'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import {
  loginWithFacebook,
  loginWithGoogleOnSuccess,
  loginWithGoogleOnFailure
} from 'relay/actions'
import GoogleLogin from 'react-google-login'
import I18n from 'I18n'
import Config from 'config'

type Props = {
  visible: boolean,
  hideModal: () => void
}

class LoginModal extends Component<Props> {
  render() {
    const { visible, hideModal } = this.props

    return (
      <ReactModal
        isOpen={visible}
        contentLabel="Login"
        onRequestClose={hideModal}
        portalClassName="modal"
        overlayClassName="modal__overlay"
        className="modal__content"
      >
        <div className="text-center">
          <button
            onClick={loginWithFacebook}
            className="btn btn--primary"
            style={{ backgroundColor: '#3b5999', width: 240 }}
          >
            <i className="fa fa-facebook" /> {I18n.action.login_with_facebook}
          </button>
          <div className="mb-md" />
          <GoogleLogin
            clientId={Config.google.appId}
            onSuccess={loginWithGoogleOnSuccess}
            onFailure={loginWithGoogleOnFailure}
            className="btn btn--primary"
            style={{ backgroundColor: '#dd4b39', width: 240 }}
          >
            <i className="fa fa-google-plus" /> {I18n.action.login_with_google}
          </GoogleLogin>
        </div>
        <div className="divider mt-lg mb-md" />
        <div className="d-flex justify-content-end">
          <button type="button" className="btn" onClick={hideModal}>
            Close
          </button>
        </div>
      </ReactModal>
    )
  }
}

const mapStateToProps = (state: Object) => ({
  visible: state.modal.visibleModal === 'LOGIN_MODAL'
})

const mapDispatchToProps = (dispatch: Function) => ({
  hideModal: () => dispatch(modalActions.hideModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal)
