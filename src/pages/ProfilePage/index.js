// @flow

import React, { Component } from 'react'
import { graphql, createFragmentContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import { isEmpty } from 'lodash'
import { Switch } from 'react-router-dom'
import { RouteWithSubRoutes } from 'routes'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType, RouterParamType } from 'flow-type'
import ProfilePageNav from 'components/ProfilePageNav'
import ProfileInfo from 'components/ProfileInfo'
import ProfileEditForm from 'components/ProfileEditForm'
import { LayoutOne } from 'layouts/PageLayout'
import MetaTag from 'components/MetaTag'
import HomeSideBar from 'components/HomeSideBar'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: {
      id: string,
      name: string,
      about: string,
      avatar: string
    }
  },
  routes: Object
}

type State = {
  editMode: boolean
}

class ProfilePageView extends Component<Props, State> {
  state = {
    editMode: false
  }

  showEditForm = () => {
    this.setState({ editMode: true })
  }

  hideEditForm = () => {
    this.setState({ editMode: false })
  }

  renderMainContent = (routes, current_user) => (
    <div>
      <div className="card">
        {this.state.editMode ? (
          <ProfileEditForm
            current_user={current_user}
            hideEditForm={this.hideEditForm}
          />
        ) : (
          <ProfileInfo
            current_user={current_user}
            showEditForm={this.showEditForm}
          />
        )}
        <div className="divider mt-lg mb-sm" />
        <ProfilePageNav />
        <div className="mt-lg">
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </div>
        <MetaTag
          title={current_user.name}
          description={current_user.about}
          image={current_user.avatar}
        />
      </div>
    </div>
  )

  render() {
    const { routes } = this.props
    const { current_user } = this.props.viewer

    if (isEmpty(current_user)) return null

    return (
      <LayoutOne
        center={this.renderMainContent(routes, current_user)}
        right={<HomeSideBar />}
      />
    )
  }
}

const ProfilePage = createFragmentContainer(ProfilePageView, {
  viewer: graphql`
    fragment ProfilePage_viewer on Viewer {
      current_user {
        id
        name
        about
        avatar
        ...ProfileInfo_current_user
      }
    }
  `
})

export default (data: RouterParamType) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query ProfilePageQuery {
        viewer {
          ...ProfilePage_viewer
        }
      }
    `}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={ProfilePage}
        />
      )
    }}
  />
)
