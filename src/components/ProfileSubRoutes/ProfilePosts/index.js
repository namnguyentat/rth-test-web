// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import Post from 'components/Post'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
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
}

class ProfilePostsView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'ProfilePosts',
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
        {current_user.posts.edges
          .map(e => e.node)
          .map(post => (
            <Post key={post.id} post={post} current_user={current_user} />
          ))}
      </div>
    )
  }
}

const ProfilePosts = createPaginationContainer(
  ProfilePostsView,
  {
    viewer: graphql`
      fragment ProfilePosts_viewer on Viewer {
        current_user {
          id
          posts(first: $count, after: $cursor)
            @connection(key: "ProfilePosts_posts") {
            edges {
              node {
                id
                ...Post_post
              }
            }
          }
          ...Post_current_user
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer.current_user && props.viewer.current_user.posts
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
      query ProfilePostsPaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...ProfilePosts_viewer
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfilePostsQuery($count: Int, $cursor: String) {
        viewer {
          ...ProfilePosts_viewer
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
          Container={ProfilePosts}
        />
      )
    }}
  />
)
