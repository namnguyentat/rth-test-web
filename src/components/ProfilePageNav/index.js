// @flow

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import I18n from 'I18n'

type Props = {}

class ProfilePageNav extends Component<Props> {
  render() {
    return (
      <div className="nav-tab">
        <NavLink
          to="/profile/posts"
          className="nav-tab__link"
          activeClassName="active"
        >
          {`Posts`}
        </NavLink>
        <NavLink
          to="/profile/following-users"
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.profile.navigation.following}
        </NavLink>
        <NavLink
          to="/profile/followers"
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.profile.navigation.follower}
        </NavLink>
        <NavLink
          to="/profile/bookmarked-posts"
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.profile.navigation.bookmarked}
        </NavLink>
        <NavLink
          to="/profile/comments"
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.profile.navigation.comment}
        </NavLink>
        <NavLink
          to="/profile/notifications"
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.profile.navigation.notification}
        </NavLink>
      </div>
    )
  }
}

export default ProfilePageNav
