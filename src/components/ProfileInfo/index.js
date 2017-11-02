// @flow

import React, { Component } from 'react'
import I18n from 'I18n'
import { graphql, createFragmentContainer } from 'react-relay'
import { changeAvatar } from 'relay/actions'

type Props = {
  current_user: {
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
    bookmark_post_count: number,
    unseen_notification_count: number
  },
  showEditForm: Function
}

class ProfileInfo extends Component<Props> {
  render() {
    const { current_user, showEditForm } = this.props

    return (
      <article className="d-flex">
        <div>
          <div>
            <img
              src={current_user.avatar}
              alt={current_user.name}
              className="avatar mr-lg"
            />
          </div>
          <label className="text-small text-normal text-center">
            <input
              type="file"
              accept="image/*"
              id="file-selector"
              style={{ display: 'none' }}
              onChange={(e: Object) => changeAvatar(e.target.files[0])}
            />
            <span>{I18n.action.edit}</span>
          </label>
        </div>
        <div>
          <h2 className="card__heading">
            {I18n.profile.name}: {current_user.name}
          </h2>
          <div>
            {I18n.profile.email}: {current_user.email}
          </div>
          <div>
            {I18n.profile.about}: {current_user.about}
          </div>
          <div>
            {I18n.profile.company}: {current_user.company}
          </div>
          <div>
            {I18n.profile.job}: {current_user.job}
          </div>
          <div>
            {I18n.profile.follower_count}: {current_user.follower_count}
          </div>
          <div>
            {I18n.profile.following_user_count}:{' '}
            {current_user.following_user_count}
          </div>

          <div>
            {I18n.profile.comment_count}: {current_user.comment_count}
          </div>
          <div>
            {I18n.profile.bookmark_post_count}:{' '}
            {current_user.bookmark_post_count}
          </div>

          <button onClick={showEditForm} className="btn btn--primary mt-md">
            {I18n.action.edit}
          </button>
        </div>
      </article>
    )
  }
}

export default createFragmentContainer(ProfileInfo, {
  current_user: graphql`
    fragment ProfileInfo_current_user on User {
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
      bookmark_post_count
      followed
      follower_count
    }
  `
})
