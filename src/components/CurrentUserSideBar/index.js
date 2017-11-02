// @flow

import React, { Component } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { graphql, QueryRenderer } from 'react-relay'
import QueryRendererHoc from 'components/QueryRendererHoc'
import { currentRelay } from 'environment'
import { isEmpty } from 'lodash'
import I18n from 'I18n'

type Props = {
  viewer: {
    current_user: {
      id: string,
      name: string,
      avatar: string,
      following_user_count: number,
      follower_count: number,
      post_count: number,
      like_count: number
    }
  }
}

class CurrentUserSideBar extends Component<Props> {
  render() {
    const { current_user } = this.props.viewer
    if (isEmpty(current_user)) return null

    return (
      <aside className="card">
        <h4 className="mb-sm">{current_user.name}</h4>
        {current_user.avatar && (
          <Link to="/profile">
            <div className="text-center mb-sm mt-sm">
              <img
                src={current_user.avatar}
                alt={current_user.name}
                style={{ width: '50%' }}
              />
            </div>
          </Link>
        )}
        <div className="text-small">
          <div className="py-sm">
            <NavLink to={`/profile/`} activeClassName="active">
              {I18n.profile.following_user_count}:{' '}
              {current_user.following_user_count}
            </NavLink>
          </div>
          <div className="divider" />
        </div>
        <div className="text-small">
          <div className="py-sm">
            <NavLink to={`/profile/followers`} activeClassName="active">
              {I18n.profile.follower_count}: {current_user.follower_count}
            </NavLink>
          </div>
          <div className="divider" />
        </div>
        <div className="text-small">
          <div className="py-sm">
            <NavLink to={`/profile/posts`} activeClassName="active">
              {I18n.profile.post_count}: {current_user.post_count}
            </NavLink>
          </div>
          <div className="divider" />
        </div>
        {/* <div className="text-small">
          <div className="py-sm">
            {I18n.profile.like_count}: {current_user.like_count}
          </div>
          <div className="divider" />
        </div> */}
      </aside>
    )
  }
}

export default (data: Object) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query CurrentUserSideBarQuery {
        viewer {
          current_user {
            id
            name
            avatar
            following_user_count
            follower_count
            post_count
            like_count
          }
        }
      }
    `}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={CurrentUserSideBar}
        />
      )
    }}
  />
)
