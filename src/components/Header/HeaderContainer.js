// @flow

import React from 'react'
import { Creators as modalActions } from 'reduxx/modalRedux'
import { graphql, QueryRenderer } from 'react-relay'
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import Header from './Header'

const mapDispatchToProps = (dispatch: Function) => ({
  showLoginModal: () => dispatch(modalActions.showModal('LOGIN_MODAL'))
})

const HeaderContainer = compose(withRouter, connect(null, mapDispatchToProps))(
  Header
)

export default (data: Object) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query HeaderContainerQuery {
        viewer {
          current_user {
            id
            name
            avatar
          }
        }
      }
    `}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={HeaderContainer}
        />
      )
    }}
  />
)
