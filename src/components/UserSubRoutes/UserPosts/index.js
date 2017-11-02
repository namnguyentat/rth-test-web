// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { getIdFromSlug } from 'lib/utils'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import Post from 'components/Post'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string
    }
  },
  user: {
    id: string,
    posts: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  }
}

class UserPostsView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'UserPosts',
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
        {user.posts.edges
          .map(e => e.node)
          .map(post => (
            <Post key={post.id} post={post} current_user={current_user} />
          ))}
      </div>
    )
  }
}

const UserPosts = createPaginationContainer(
  UserPostsView,
  {
    viewer: graphql`
      fragment UserPosts_viewer on Viewer {
        current_user {
          id
          ...Post_current_user
        }
      }
    `,
    user: graphql`
      fragment UserPosts_user on User {
        id
        posts(first: $count, after: $cursor)
          @connection(key: "UserPosts_posts") {
          edges {
            node {
              id
              ...Post_post
            }
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.posts
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
      query UserPostsPaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...UserPosts_viewer
        }
        user(id: $id) {
          ...UserPosts_user @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query UserPostsQuery($id: GlobalIdInput!, $count: Int, $cursor: String) {
        viewer {
          ...UserPosts_viewer
        }
        user(id: $id) {
          ...UserPosts_user @arguments(id: $id)
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
          Container={UserPosts}
        />
      )
    }}
  />
)
