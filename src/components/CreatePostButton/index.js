// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Creators as modalActions } from 'reduxx/modalRedux'
import I18n from 'I18n'
import PostModal from 'components/Modal/PostModal'

type Props = {
  showPostModal: () => void
}

class dPostButton extends Component<Props> {
  render() {
    const { showPostModal } = this.props

    return (
      <aside className="card">
        <button onClick={showPostModal} className="btn btn--primary">
          <i className='fa fa-plus' /> {I18n.post.create_post}
        </button>
        <PostModal />
      </aside>
    )
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  showPostModal: () => dispatch(modalActions.showModal('POST_MODAL'))
})

export default connect(null, mapDispatchToProps)(dPostButton)
