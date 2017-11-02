// @flow

import React, { Component } from 'react'
import MediaQuery from 'react-responsive'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

type Props = {
  showLoginModal: () => void,
  viewer: {
    current_user: {
      id: string,
      name: string,
      avatar: string
    }
  },
  isShow: boolean,
  toggle: () => void
}

class Header extends Component<Props> {
  render() {
    const {
      viewer: { current_user: user },
      showLoginModal,
      isShow,
      toggle
    } = this.props

    return (
      <div>
        <MediaQuery minDeviceWidth={992}>
          <DesktopHeader user={user} showLoginModal={showLoginModal} />
        </MediaQuery>
        <MediaQuery maxDeviceWidth={991}>
          <MobileHeader
            user={user}
            showLoginModal={showLoginModal}
            isShow={isShow}
            toggle={toggle}
          />
        </MediaQuery>
      </div>
    )
  }
}

export default Header
