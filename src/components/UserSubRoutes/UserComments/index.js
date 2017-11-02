// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { Link } from 'react-router-dom'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { getIdFromSlug } from 'lib/utils'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import Comment from 'components/Comment'
import { slugify } from 'lib/utils'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string
    }
  },
  user: {
    id: string,
    comments: {
      edges: Array<{
        node: {
          id: string,
          commentable: {
            id: string,
            title: string
          }
        }
      }>
    }
  }
}

class UserCommentsView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'UserComments',
          func: 'fetchMore'
        })
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

  render() {
    const { user } = this.props
    const { current_user } = this.props.viewer

    if (isEmpty(user)) return null

    return (
      <div>
        {user.comments.edges.map(e => e.node).map(comment => (
          <div className="card mb-md" key={comment.id}>
            <Link
              to={`/posts/${slugify(comment.commentable.title)}-${comment
                .commentable.id}`}
              className="card__heading-link"
            >
              <h3 className="card__heading">{comment.commentable.title}</h3>
            </Link>
            <Comment comment={comment} current_user={current_user} />
          </div>
        ))}
      </div>
    )
  }
}

const UserComments = createPaginationContainer(
  UserCommentsView,
  {
    viewer: graphql`
      fragment UserComments_viewer on Viewer {
        current_user {
          id
          ...Comment_current_user
        }
      }
    `,
    user: graphql`
      fragment UserComments_user on User {
        id
        comments(first: $count, after: $cursor)
          @connection(key: "UserComments_comments") {
          edges {
            node {
              id
              ...Comment_comment
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
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.comments
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        id: fragmentVariables.id
      }
    },
    query: graphql`
      query UserCommentsPaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...UserComments_viewer
        }
        user(id: $id) {
          ...UserComments_user @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query UserCommentsQuery(
        $id: GlobalIdInput!
        $count: Int
        $cursor: String
      ) {
        viewer {
          ...UserComments_viewer
        }
        user(id: $id) {
          ...UserComments_user @arguments(id: $id)
        }
      }
    `}
    variables={{ id: getIdFromSlug(data.match.params.id) }}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={UserComments}
        />
      )
    }}
  />
)
