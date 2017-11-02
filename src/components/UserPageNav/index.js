// @flow

import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { slugify } from 'lib/utils'
import { graphql, createFragmentContainer } from 'react-relay'
import I18n from 'I18n'

type Props = {
  user: {
    id: string,
    name: string
  }
}

class UserPageNav extends Component<Props> {
  render() {
    const { user } = this.props

    return (
      <div className="nav-tab">
        <NavLink
          to={`/users/${slugify(user.name)}-${user.id}/posts`}
          className="nav-tab__link"
          activeClassName="active"
        >
          {`Posts`}
        </NavLink>
        <NavLink
          to={`/users/${slugify(user.name)}-${user.id}/following-users`}
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.user.navigation.following}
        </NavLink>
        <NavLink
          to={`/users/${slugify(user.name)}-${user.id}/followers`}
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.user.navigation.follower}
        </NavLink>
        <NavLink
          to={`/users/${slugify(user.name)}-${user.id}/comments`}
          className="nav-tab__link"
          activeClassName="active"
        >
          {I18n.user.navigation.comment}
        </NavLink>
      </div>
    )
  }
}

export default createFragmentContainer(UserPageNav, {
  user: graphql`
    fragment UserPageNav_user on User {
      id
      name
    }
  `
})
