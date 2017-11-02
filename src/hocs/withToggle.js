// @flow

import { withStateHandlers } from 'recompose'

const withToggle = withStateHandlers(
  ({ isShow = false }) => ({
    isShow
  }),
  {
    toggle: ({ isShow }) => () => ({
      isShow: !isShow
    }),
    hide: ({ isShow }) => () => ({
      isShow: false
    }),
    show: ({ isShow }) => () => ({
      isShow: true
    })
  }
)

export default withToggle
