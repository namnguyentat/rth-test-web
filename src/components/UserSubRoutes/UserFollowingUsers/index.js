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
import User from 'components/User'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string
    }
  },
  user: {
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

class UserFollowingUsersView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'UserFollowingUsers',
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
        {user.following_users.edges
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

const UserFollowingUsers = createPaginationContainer(
  UserFollowingUsersView,
  {
    viewer: graphql`
      fragment UserFollowingUsers_viewer on Viewer {
        current_user {
          id
          ...User_current_user
        }
      }
    `,
    user: graphql`
      fragment UserFollowingUsers_user on User {
        id
        following_users(first: $count, after: $cursor)
          @connection(key: "UserFollowingUsers_following_users") {
          edges {
            node {
              id
              ...User_user
            }
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.user && props.user.following_users
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
      query UserFollowingUsersPaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...UserFollowingUsers_viewer
        }
        user(id: $id) {
          ...UserFollowingUsers_user @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query UserFollowingUsersQuery(
        $id: GlobalIdInput!
        $count: Int
        $cursor: String
      ) {
        viewer {
          ...UserFollowingUsers_viewer
        }
        user(id: $id) {
          ...UserFollowingUsers_user @arguments(id: $id)
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
          Container={UserFollowingUsers}
        />
      )
    }}
  />
)
