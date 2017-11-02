// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { slugify, timeFromNow } from 'lib/utils'
import EditReplyForm from 'components/Reply/EditForm'
import { toggleUpvoteReply } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  current_user: ?{
    id: string
  },
  reply: {
    id: string,
    content: string,
    upvoted: boolean,
    upvote_count: number,
    created_at: string,
    user: {
      id: string,
      name: string,
      avatar: string
    }
  }
}

type State = {
  editMode: boolean
}

class Reply extends Component<Props, State> {
  state = {
    editMode: false
  }

  showEditForm = () => {
    this.setState({ editMode: true })
  }

  hideEditForm = () => {
    this.setState({ editMode: false })
  }

  renderView = () => {
    const { reply, current_user } = this.props
    const currnetUserIsOwner = current_user && current_user.id === reply.user.id

    return (
      <div className="d-flex mt-md">
        <Link
          to={`/users/${slugify(reply.user.name)}-${reply.user.id}`}
          className="mr-md"
        >
          <img
            src={reply.user.avatar}
            alt={reply.user.name}
            className="avatar"
          />
        </Link>
        <div className="item-fullfill">
          <Link
            to={`/users/${slugify(reply.user.name)}-${reply.user.id}`}
            className="text-bold"
          >
            {reply.user.name}
          </Link>
          <div className="text-muted text-small mb-sm">
            {timeFromNow(reply.created_at)}
          </div>
          <div className="mb-sm">{reply.content}</div>
          <div className="d-flex">
            <button
              onClick={() => toggleUpvoteReply(reply)}
              className={cx('btn btn--text text-small mr-md', {
                'text-primary': reply.upvoted,
                'text-muted': !reply.upvoted
              })}
            >
              <i className="fa fa-thumbs-up" /> {I18n.action.likes} ({reply.upvote_count})
            </button>
            {currnetUserIsOwner && (
              <button
                onClick={this.showEditForm}
                className="btn btn--text text-primary text-small"
              >
                <i className="fa fa-pencil" /> {I18n.action.edit}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  renderEdit = () => {
    const { reply } = this.props

    return <EditReplyForm reply={reply} hideEditForm={this.hideEditForm} />
  }

  render() {
    if (this.state.editMode) {
      return this.renderEdit()
    } else {
      return this.renderView()
    }
  }
}

export default createFragmentContainer(Reply, {
  current_user: graphql`
    fragment Reply_current_user on User {
      id
    }
  `,
  reply: graphql`
    fragment Reply_reply on Reply {
      id
      content
      upvoted
      upvote_count
      created_at
      user {
        id
        name
        avatar
      }
    }
  `
})
