// @flow

import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { graphql, createFragmentContainer } from 'react-relay'
import { toggleFollowUser } from 'relay/actions'

type Props = {
  user: {
    id: string,
    name: string,
    about: string,
    avatar: string,
    followed: boolean,
    follower_count: number
  },
  current_user: {
    id: string
  }
}

const User = (props: Props) => {
  const { user, current_user } = props
  const followable = current_user && current_user.id !== user.id

  return (
    <div key={user.id} className="d-flex mb-md">
      <Link to={`/users/${user.id}`} className="mr-sm">
        <img src={user.avatar} className="avatar" alt={user.name} />
      </Link>
      <div className="item-fullfill d mr-sm">
        <div className="text-bold" text-bol>
          {user.name}
        </div>
        <div className="text-muted text-small">{user.about}</div>
      </div>
      {followable && (
        <button
          onClick={() => toggleFollowUser(user)}
          className="btn btn--text"
        >
          <i
            className={cx('fa fa-lg', {
              'fa-user-plus text-muted': !user.followed,
              'fa-user-times text-primary': user.followed
            })}
          />
        </button>
      )}
    </div>
  )
}

export default createFragmentContainer(User, {
  user: graphql`
    fragment User_user on User {
      id
      avatar
      name
      about
      followed
      follower_count
    }
  `,
  current_user: graphql`
    fragment User_current_user on User {
      id
    }
  `
})
