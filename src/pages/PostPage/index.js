// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import cx from 'classnames'
import { currentRelay } from 'environment'
import { LayoutOne } from 'layouts/PageLayout'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import { isEmpty } from 'lodash'
import {
  getIdFromSlug,
  timeFromNow,
  convertConstentStateToText
} from 'lib/utils'
import Comment from 'components/Comment'
import NewCommentForm from 'components/Comment/NewForm'
import { toggleUpvotePost, toggleBookmarkPost } from 'relay/actions'
import HomeSideBar from 'components/HomeSideBar'
import I18n from 'I18n'
import MetaTag from 'components/MetaTag'
import LoginPromt from 'components/LoginPromt'
import EditorContent from 'components/EditorContent'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: ?{
      id: string
    }
  },
  post: {
    id: string,
    title: string,
    image: string,
    content: string,
    created_at: string,
    upvoted: boolean,
    upvote_count: number,
    bookmarked: boolean,
    comments: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  }
}

class PostPageView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, { file: 'PostPage', func: 'fetchMore' })
      }
    })
  }

  scrollHandler = (e: Event) => {
    endOfPage() && this.fetchMore()
  }

  componentWillMount() {
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  renderMainContent = (post, current_user, comments) => (
    <div>
      <div key={post.id} className="card">
        {/* {post.image && (
          <Link
            to={`/posts/${slugify(post.title)}-${post.id}`}
            className="card__thumbnail mb-md"
          >
            <img src={post.image} alt={post.title} className="card__img" />
          </Link>
        )} */}
        <h2 className="card__heading mb-sm">{post.title}</h2>
        <div className="mb-sm mt-md">
          <EditorContent content={post.content} />
        </div>
        <div className="mb-sm text-muted">{timeFromNow(post.created_at)}</div>
        <div className="divider mb-md" />
        <div className="mb-md">
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
        </div>
        {current_user ? (
          <NewCommentForm post={post} />
        ) : (
          <LoginPromt text={I18n.action.login_to_comment} />
        )}
        <h3 className="mb-sm mt-md">{I18n.post.comments}</h3>
        <div className="divider mb-md" />
        {comments.map(comment => (
          <Comment
            key={comment.id}
            comment={comment}
            current_user={current_user}
          />
        ))}
      </div>
      {endOfPage() && this.fetchMore()}
      <MetaTag
        title={post.title}
        description={convertConstentStateToText(post.content)}
        image={post.image}
      />
    </div>
  )

  render() {
    const { post, viewer } = this.props
    const { current_user } = viewer
    const comments = post.comments.edges.map(edge => edge.node)

    return (
      <LayoutOne
        center={this.renderMainContent(post, current_user, comments)}
        right={<HomeSideBar />}
      />
    )
  }
}

const PostPage = createPaginationContainer(
  PostPageView,
  {
    viewer: graphql`
      fragment PostPage_viewer on Viewer {
        current_user {
          id
          ...Comment_current_user
        }
      }
    `,
    post: graphql`
      fragment PostPage_post on Post {
        id
        title
        image
        content
        upvoted
        upvote_count
        bookmarked
        created_at
        comments(first: $count, after: $cursor)
          @connection(key: "PostPage_comments") {
          edges {
            node {
              id
              ...Comment_comment
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.post && props.post.comments
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        id: fragmentVariables.id,
        count,
        cursor
      }
    },
    query: graphql`
      query PostPagePaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...PostPage_viewer
        }
        post(id: $id) {
          ...PostPage_post @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: RouterParamType) => {
  return (
    <QueryRenderer
      environment={currentRelay.store}
      query={graphql`
        query PostPageQuery($id: GlobalIdInput!, $count: Int, $cursor: String) {
          viewer {
            ...PostPage_viewer
          }
          post(id: $id) {
            ...PostPage_post @arguments(id: $id)
          }
        }
      `}
      variables={{
        id: getIdFromSlug(data.match.params.id),
        count: DEFAULT_LOAD_SIZE
      }}
      render={(readyState: Object) => {
        return (
          <QueryRendererHoc
            needHideSpinner
            readyState={readyState}
            data={data}
            Container={PostPage}
          />
        )
      }}
    />
  )
}
