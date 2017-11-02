// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { slugify, timeFromNow } from 'lib/utils'
import { toggleUpvotePost, toggleBookmarkPost } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  viewer: {
    current_user: ?{
      id: string
    }
  },
  post: {
    id: string,
    title: string,
    image: string,
    upvoted: boolean,
    upvote_count: number,
    comment_count: number,
    bookmarked: boolean,
    created_at: string
  }
}

class Post extends Component<Props> {
  render() {
    const { post } = this.props

    return (
      <div key={post.id} className="card mb-lg">
        {/* {post.image && (
          <Link
            to={`/posts/${slugify(post.title)}-${post.id}`}
            className="card__thumbnail mb-sm"
          >
            <img className="card__img" src={post.image} alt={post.title} />
          </Link>
        )} */}
        <div className="card-body">
          <Link
            to={`/posts/${slugify(post.title)}-${post.id}`}
            className="card__heading-link"
          >
            <h2 className="card__heading mb-sm">{post.title}</h2>
          </Link>
          <div className="text-muted text-small mb-sm">
            {timeFromNow(post.created_at)}
          </div>
          <div className="divider my-md" />
          <button
            onClick={() => toggleUpvotePost(post)}
            className={cx('btn btn--text text-small mr-md', {
              'text-primary': post.upvoted,
              'text-muted': !post.upvoted
            })}
          >
            <i className="fa fa-thumbs-up" />{' '}
            {post.upvoted
              ? `${I18n.action.upvoted} (${post.upvote_count})`
              : I18n.action.upvote}
          </button>
          <button
            onClick={() => toggleBookmarkPost(post)}
            className={cx('btn btn--text text-small mr-md', {
              'text-primary': post.bookmarked,
              'text-muted': !post.bookmarked
            })}
          >
            <i className="fa fa-bookmark" />{' '}
            {post.bookmarked ? I18n.action.bookmarked : I18n.action.bookmark}
          </button>
          <Link
            className="text-small"
            to={`/posts/${slugify(post.title)}-${post.id}`}
          >{`${I18n.post.comment} (${post.comment_count})`}</Link>
        </div>
      </div>
    )
  }
}

export default createFragmentContainer(Post, {
  current_user: graphql`
    fragment Post_current_user on User {
      id
    }
  `,
  post: graphql`
    fragment Post_post on Post {
      id
      title
      image
      created_at
      upvoted
      upvote_count
      comment_count
      bookmarked
    }
  `
})
