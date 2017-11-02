// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import { isEmpty } from 'lodash'
import { Switch } from 'react-router-dom'
import { RouteWithSubRoutes } from 'routes'
import { currentRelay } from 'environment'
import { LayoutTwo } from 'layouts/PageLayout'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import { getIdFromSlug } from 'lib/utils'
import UserPageNav from 'components/UserPageNav'
import UserProfileInfo from 'components/UserProfileInfo'
import MetaTag from 'components/MetaTag'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string
    }
  },
  user: {
    id: string,
    name: string,
    about: string,
    avatar: string
  },
  routes: Object
}

class UserPageView extends Component<Props> {
  render() {
    const { user, viewer, routes } = this.props
    const { current_user } = viewer

    if (isEmpty(user)) return null

    return (
      <LayoutTwo
        center={
          <div className="card">
            <UserProfileInfo user={user} current_user={current_user} />
            <div className="divider my-md" />
            <UserPageNav user={user} />
            <div className="mt-lg">
              <Switch>
                {routes.map((route, i) => (
                  <RouteWithSubRoutes key={i} {...route} />
                ))}
              </Switch>
            </div>
            <MetaTag
              title={user.name}
              description={user.about}
              image={user.avatar}
            />
          </div>
        }
      />
    )
  }
}

const UserPage = createFragmentContainer(UserPageView, {
  viewer: graphql`
    fragment UserPage_viewer on Viewer {
      current_user {
        id
        ...UserProfileInfo_current_user
      }
    }
  `,
  user: graphql`
    fragment UserPage_user on User {
      id
      name
      about
      avatar
      ...UserProfileInfo_user
      ...UserPageNav_user
    }
  `
})

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query UserPageQuery($id: GlobalIdInput!) {
        viewer {
          ...UserPage_viewer
        }
        user(id: $id) {
          ...UserPage_user
          ...UserPageNav_user
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
          Container={UserPage}
        />
      )
    }}
  />
)
