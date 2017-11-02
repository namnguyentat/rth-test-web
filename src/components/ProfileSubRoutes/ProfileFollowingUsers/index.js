// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import User from 'components/User'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string,
      following_users: {
        edges: Array<{
          node: {
            id: string
          }
        }>
      }
    }
  }
}

class ProfileFollowingUsersView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'ProfileFollowingUsers',
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
    const { current_user } = this.props.viewer

    if (isEmpty(current_user)) return null

    return (
      <div>
        {current_user.following_users.edges
          .map(e => e.node)
          .map(following_user => (
            <User
              key={following_user.id}
              user={following_user}
              current_user={current_user}
            />
          ))}
      </div>
    )
  }
}

const ProfileFollowingUsers = createPaginationContainer(
  ProfileFollowingUsersView,
  {
    viewer: graphql`fragment ProfileFollowingUsers_viewer on Viewer {
        current_user {
          id
          following_users(first: $count, after: $cursor) @connection(key: "ProfileFollowingUsers_following_users") {
            edges {
              node {
                id
                ...User_user
              }
            }
          }
          ...User_current_user
        }
      }`
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return (
        props.viewer.current_user && props.viewer.current_user.following_users
      )
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
      query ProfileFollowingUsersPaginationQuery(
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...ProfileFollowingUsers_viewer
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfileFollowingUsersQuery($count: Int, $cursor: String) {
        viewer {
          ...ProfileFollowingUsers_viewer
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
          Container={ProfileFollowingUsers}
        />
      )
    }}
  />
)
