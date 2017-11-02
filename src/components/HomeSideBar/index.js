// @flow

import React from 'react'
import CurrentUserSideBar from 'components/CurrentUserSideBar'
import ActivityList from 'components/ActivityList'
import FeedbackButton from 'components/FeedbackButton'

type Props = {}

const HomeSideBar = (props: Props) => {
  return (
    <div>
      <div className="mb-md">
        <CurrentUserSideBar />
      </div>
      <div className="mb-md">
        <ActivityList />
      </div>
      <div className="mb-md">
        <FeedbackButton />
      </div>
    </div>
  )
}

export default HomeSideBar
