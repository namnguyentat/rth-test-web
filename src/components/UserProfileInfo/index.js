// @flow

import React, { Component } from 'react'
import cx from 'classnames'
import { graphql, createFragmentContainer } from 'react-relay'
import { toggleFollowUser } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  user: {
    id: string,
    avatar: string,
    name: string,
    email: string,
    about: string,
    company: string,
    job: string,
    follower_count: number,
    following_user_count: number,
    comment_count: number,
    followed: boolean,
    follower_count: number
  },
  current_user: {
    id: string
  }
}

class UserProfileInfo extends Component<Props> {
  render() {
    const { user, current_user } = this.props
    const followable = current_user && current_user !== user.id

    return (
      <article className="d-flex">
        <img src={user.avatar} alt={user.name} className="avatar mr-lg" />
        <div>
          <h2 className="card__heading">{I18n.profile.name}: {user.name}</h2>
          <p>
            {I18n.profile.email}: {user.email}
            <br />
            {I18n.profile.about}: {user.about}
            <br />
            {I18n.profile.company}: {user.company}
            <br />
            {I18n.profile.job}: {user.job}
            <br />
            {I18n.profile.follower_count}: {user.follower_count}
            <br />
            {I18n.profile.following_user_count}: {user.following_user_count}
            <br />
            {I18n.profile.comment_count}: {user.comment_count}
            <br />
          </p>
          {followable && (
            <button
              onClick={() => toggleFollowUser(user)}
              className={cx('btn', {
                'btn--primary': user.followed
              })}
            >
              {user.followed ? I18n.action.followed : I18n.action.follow}
            </button>
          )}
        </div>
      </article>
    )
  }
}

export default createFragmentContainer(UserProfileInfo, {
  user: graphql`
    fragment UserProfileInfo_user on User {
      id
      avatar
      name
      email
      about
      company
      job
      follower_count
      following_user_count
      comment_count
      followed
      follower_count
    }
  `,
  current_user: graphql`
    fragment UserProfileInfo_current_user on User {
      id
    }
  `
})
