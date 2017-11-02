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
    followers: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  }
}

class UserFollowersView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'UserFollowers',
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
        {user.followers.edges
          .map(e => e.node)
          .map(follower => (
            <User
              key={follower.id}
              user={follower}
              current_user={current_user}
            />
          ))}
      </div>
    )
  }
}

const UserFollowers = createPaginationContainer(
  UserFollowersView,
  {
    viewer: graphql`
      fragment UserFollowers_viewer on Viewer {
        current_user {
          id
          ...User_current_user
        }
      }
    `,
    user: graphql`
      fragment UserFollowers_user on User {
        id
        followers(first: $count, after: $cursor)
          @connection(key: "UserFollowers_followers") {
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
      return props.user && props.user.followers
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
      query UserFollowersPaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...UserFollowers_viewer
        }
        user(id: $id) {
          ...UserFollowers_user @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query UserFollowersQuery(
        $id: GlobalIdInput!
        $count: Int
        $cursor: String
      ) {
        viewer {
          ...UserFollowers_viewer
        }
        user(id: $id) {
          ...UserFollowers_user @arguments(id: $id)
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
          Container={UserFollowers}
        />
      )
    }}
  />
)
