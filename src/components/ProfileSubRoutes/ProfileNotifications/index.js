// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import NotificationItem from 'components/NotificationItem'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string,
      notifications: {
        edges: Array<{
          node: {
            id: string
          }
        }>
      }
    }
  }
}

class ProfileNotificationsView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, {
          file: 'ProfileNotifications',
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
        {current_user.notifications.edges
          .map(e => e.node)
          .map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
      </div>
    )
  }
}

const ProfileNotifications = createPaginationContainer(
  ProfileNotificationsView,
  {
    viewer: graphql`
      fragment ProfileNotifications_viewer on Viewer {
        current_user {
          id
          notifications(first: $count, after: $cursor)
            @connection(key: "ProfileNotifications_notifications") {
            edges {
              node {
                id
                ...NotificationItem_notification
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
      return (
        props.viewer.current_user && props.viewer.current_user.notifications
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
      query ProfileNotificationsPaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...ProfileNotifications_viewer
        }
      }
    `
  }
)

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfileNotificationsQuery($count: Int, $cursor: String) {
        viewer {
          ...ProfileNotifications_viewer
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
          Container={ProfileNotifications}
        />
      )
    }}
  />
)
