// @flow

import React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Link } from 'react-router-dom'
import { slugify, timeFromNow } from 'lib/utils'
import I18n from 'I18n'

type Props = {
  notification: {
    id: string,
    action: string,
    created_at: string,
    actor: {
      id: string,
      name: string,
      avatar: string
    },
    resource: {
      commentable: {
        id: string,
        title: string
      },
      comment: {
        commentable: {
          id: string,
          title: string
        }
      }
    }
  }
}

const tartgetLink = (action, resource, actor) => {
  switch (action) {
    case 'follow_user':
      return `/users/${slugify(actor.name)}-${actor.id}`
    case 'upvote_comment':
      return `/posts/${slugify(resource.commentable.title)}-${resource
        .commentable.id}`
    case 'reply_comment':
      return `/posts/${slugify(resource.comment.commentable.title)}-${resource
        .comment.commentable.id}`
    case 'upvote_reply':
      return `/posts/${slugify(resource.comment.commentable.title)}-${resource
        .comment.commentable.id}`
    default:
      return null
  }
}

const NotificationItem = (props: Props) => {
  const { notification } = props
  const { actor, action, resource } = notification

  return <div className="mb-md">
      <div className="d-flex mt-md">
        <Link to={`/users/${slugify(actor.name)}-${actor.id}`} className="mr-md">
          <img src={actor.avatar} alt={actor.name} className="avatar" />
        </Link>
        <div className="item-fullfill mr-lg">
          <Link to={tartgetLink(action, resource, actor)} className="text-small">
            {I18n.notification.action[notification.action]}
          </Link>
          <div className="text-muted text-small mb-sm">
            {timeFromNow(notification.created_at)}
          </div>
        </div>
      </div>
    </div>
}

export default createFragmentContainer(NotificationItem, {
  notification: graphql`
    fragment NotificationItem_notification on Notification {
      id
      action
      created_at
      actor {
        id
        avatar
        name
      }
      resource {
        ... on Comment {
          id
          commentable {
            ... on Post {
              id
              title
            }
          }
        }
        ... on Reply {
          id
          comment {
            id
            commentable {
              ... on Post {
                id
                title
              }
            }
          }
        }
      }
    }
  `
})
