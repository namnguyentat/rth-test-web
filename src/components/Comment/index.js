// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { slugify, timeFromNow } from 'lib/utils'
import EditCommentForm from 'components/Comment/EditForm'
import { toggleUpvoteComment } from 'relay/actions'
import I18n from 'I18n'
import Replies from './Replies'

type Props = {
  current_user: ?{
    id: string
  },
  comment: {
    id: string,
    content: string,
    upvoted: boolean,
    upvote_count: number,
    reply_count: number,
    created_at: string,
    user: {
      id: string,
      name: string,
      avatar: string
    }
  }
}

type State = {
  editMode: boolean,
  repliesVisible: boolean
}

class Comment extends Component<Props, State> {
  state = {
    editMode: false,
    repliesVisible: false
  }

  showEditForm = () => {
    this.setState({ editMode: true })
  }

  hideEditForm = () => {
    this.setState({ editMode: false })
  }

  toggleReplies = () => {
    this.setState({ repliesVisible: !this.state.repliesVisible })
  }

  renderView = () => {
    const { comment, current_user } = this.props
    const currnetUserIsOwner =
      current_user && current_user.id === comment.user.id

    return (
      <div className="mt-md mb-md">
        <div className="d-flex">
          <Link
            to={`/users/${slugify(comment.user.name)}-${comment.user.id}`}
            className="mr-md"
          >
            <img
              src={comment.user.avatar}
              alt={comment.user.name}
              className="avatar"
            />
          </Link>
          <div className="item-fullfill">
            <Link
              to={`/users/${slugify(comment.user.name)}-${comment.user.id}`}
              className="text-bold"
            >
              {comment.user.name}
            </Link>
            <div className="text-muted text-small mb-sm">
              {timeFromNow(comment.created_at)}
            </div>
            <div className="mb-sm">{comment.content}</div>
            <div className="d-flex flex-wrap">
              <button
                onClick={() => toggleUpvoteComment(comment)}
                className={cx('btn btn--text text-small mr-md mb-xs', {
                  'text-primary': comment.upvoted,
                  'text-muted': !comment.upvoted
                })}
              >
                <i className="fa fa-thumbs-up" /> {I18n.action.likes} ({comment.upvote_count})
              </button>
              <button
                onClick={this.toggleReplies}
                className="btn btn--text text-primary text-small mr-md mb-xs"
              >
                <i className="fa fa-reply" />{' '}
                {`${I18n.action.reply} (${comment.reply_count})`}
              </button>
              {currnetUserIsOwner && (
                <button
                  onClick={this.showEditForm}
                  className="btn btn--text text-primary text-small mb-xs"
                >
                  <i className="fa fa-pencil" /> {I18n.action.edit}
                </button>
              )}
            </div>
          </div>
        </div>
        {this.state.repliesVisible && <Replies commentId={comment.id} />}
      </div>
    )
  }

  renderEdit = () => {
    const { comment } = this.props

    return (
      <EditCommentForm comment={comment} hideEditForm={this.hideEditForm} />
    )
  }

  render() {
    if (this.state.editMode) {
      return this.renderEdit()
    } else {
      return this.renderView()
    }
  }
}

export default createFragmentContainer(Comment, {
  current_user: graphql`
    fragment Comment_current_user on User {
      id
    }
  `,
  comment: graphql`
    fragment Comment_comment on Comment {
      id
      content
      upvoted
      upvote_count
      created_at
      reply_count
      user {
        id
        name
        avatar
      }
    }
  `
})
