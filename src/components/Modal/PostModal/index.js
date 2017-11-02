// @flow

import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { Creators as modalActions } from 'reduxx/modalRedux'
import { connect } from 'react-redux'
import ReactModal from 'react-modal'
import I18n from 'I18n'
import { createPost } from 'relay/actions'

type Props = {
  visible: boolean,
  hideModal: () => void,
  handleSubmit: Function
}

class PostModal extends Component<Props> {
  render() {
    const { visible, hideModal, handleSubmit } = this.props

    if (!visible) {
      return null
    }

    return (
      <ReactModal
        isOpen={visible}
        contentLabel="Post"
        onRequestClose={hideModal}
        portalClassName="modal"
        overlayClassName="modal__overlay"
        className="modal__content"
      >
        <form onSubmit={handleSubmit} className="f">
          <div className="mb-md">
            <div className="text-bold text-small">{I18n.post.title}:</div>
            <Field
              name="title"
              component="input"
              className="f__control"
              required
            />
          </div>
          <div className="mb-md">
            <div className="text-bold text-small">{I18n.post.content}:</div>
            <Field
              name="content"
              component="textarea"
              rows={4}
              className="f__control"
              required
            />
          </div>
          <div className="divider mt-lg mb-md" />
          <div className="d-flex justify-content-end">
            <button type="button" className="btn mr-md" onClick={hideModal}>
              {I18n.action.close}
            </button>
            <button type="submit" className="btn btn--primary">
              {I18n.action.submit}
            </button>
          </div>
        </form>
      </ReactModal>
    )
  }
}

const mapStateToProps = (state: Object) => ({
  visible: state.modal.visibleModal === 'POST_MODAL'
})

const mapDispatchToProps = (dispatch: Function) => ({
  hideModal: () => dispatch(modalActions.hideModal()),
  onSubmit: post => {
    createPost(post)
    dispatch(modalActions.hideModal())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'PostForm' })(PostModal)
)
