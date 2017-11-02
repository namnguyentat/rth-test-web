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
      followers: {
        edges: Array<{
          node: {
            id: string
          }
        }>
      }
    }
  }
}

class ProfileFollowersView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'ProfileFollowers',
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
        {current_user.followers.edges
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

const ProfileFollowers = createPaginationContainer(
  ProfileFollowersView,
  {
    viewer: graphql`
      fragment ProfileFollowers_viewer on Viewer {
        current_user {
          id
          followers(first: $count, after: $cursor)
            @connection(key: "ProfileFollowers_followers") {
            edges {
              node {
                id
                ...User_user
              }
            }
          }
          ...User_current_user
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.viewer.current_user && props.viewer.current_user.followers
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
      query ProfileFollowersPaginationQuery(
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...ProfileFollowers_viewer
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfileFollowersQuery($count: Int, $cursor: String) {
        viewer {
          ...ProfileFollowers_viewer
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
          Container={ProfileFollowers}
        />
      )
    }}
  />
)
