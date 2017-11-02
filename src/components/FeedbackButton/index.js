// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Creators as modalActions } from 'reduxx/modalRedux'
import I18n from 'I18n'
import FeedbackModal from 'components/Modal/FeedbackModal'

type Props = {
  showFeedbackModal: () => void
}

class FeedbackButton extends Component<Props> {
  render() {
    const { showFeedbackModal } = this.props

    return (
      <aside className="card">
        <button onClick={showFeedbackModal} className="btn btn--primary">
          <i className="fa fa-reply" /> {I18n.action.feedback}
        </button>
        <div className="text-small mt-md mb-md">{I18n.feedback.promt_text}</div>
        <FeedbackModal />
      </aside>
    )
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  showFeedbackModal: () => dispatch(modalActions.showModal('FEEDBACK_MODAL'))
})

export default connect(null, mapDispatchToProps)(FeedbackButton)
