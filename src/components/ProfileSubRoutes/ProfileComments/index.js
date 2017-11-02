// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { Link } from 'react-router-dom'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import Comment from 'components/Comment'
import { slugify } from 'lib/utils'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
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
}

class ProfileCommentsView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'ProfileComments',
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
    const { viewer } = this.props
    const { current_user } = viewer

    if (isEmpty(current_user)) return null

    return (
      <div>
        {current_user.comments.edges.map(e => e.node).map(comment => (
          <div key={comment.id} className="card mb-md">
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

const ProfileComments = createPaginationContainer(
  ProfileCommentsView,
  {
    viewer: graphql`
      fragment ProfileComments_viewer on Viewer {
        current_user {
          id
          comments(first: $count, after: $cursor)
            @connection(key: "ProfileComments_comments") {
            edges {
              node {
                id
                ...Comment_comment
                commentable {
                  ... on Post {
                    id
                    title
                    ...Post_post
                  }
                }
              }
            }
          }
          ...Comment_current_user
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer.current_user && props.viewer.current_user.comments
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
        cursor
      }
    },
    query: graphql`
      query ProfileCommentsPaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...ProfileComments_viewer
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfileCommentsQuery($count: Int, $cursor: String) {
        viewer {
          ...ProfileComments_viewer
        }
      }
    `}
    variables={{
      count: DEFAULT_LOAD_SIZE
    }}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={ProfileComments}
        />
      )
    }}
  />
)
