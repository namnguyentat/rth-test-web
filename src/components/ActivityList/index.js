// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType } from 'flow-type'
import { isEmpty } from 'lodash'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import NotificationItem from 'components/NotificationItem'
import I18n from 'I18n'

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

class ActivityListView extends Component<Props> {
  render() {
    const { current_user } = this.props.viewer

    if (isEmpty(current_user)) return null

    return <aside className="card">
        <h4 className="mb-sm">{I18n.activity.activities}</h4>
        {current_user.notifications.edges
          .map(e => e.node)
          .map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
      </aside>
  }
}

const ActivityList = createFragmentContainer(ActivityListView, {
  viewer: graphql`
    fragment ActivityList_viewer on Viewer {
      current_user {
        id
        notifications(first: $count, after: $cursor)
          @connection(key: "ActivityList_notifications") {
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
})

export default (data: Object) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ActivityListQuery($count: Int, $cursor: String) {
        viewer {
          ...ActivityList_viewer
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
          Container={ActivityList}
        />
      )
    }}
  />
)
