import React from 'react'
import { Route } from 'react-router-dom'

import HomePage from 'pages/HomePage'
import NewPostPage from 'pages/NewPostPage'
import PostPage from 'pages/PostPage'
import UserPage from 'pages/UserPage'
import UserPosts from 'components/UserSubRoutes/UserPosts'
import UserFollowingUsers from 'components/UserSubRoutes/UserFollowingUsers'
import UserFollowers from 'components/UserSubRoutes/UserFollowers'
import UserComments from 'components/UserSubRoutes/UserComments'
import ProfilePage from 'pages/ProfilePage'
import ProfileFollowingUsers from 'components/ProfileSubRoutes/ProfileFollowingUsers'
import ProfileFollowers from 'components/ProfileSubRoutes/ProfileFollowers'
import ProfileBookmarkedPosts from 'components/ProfileSubRoutes/ProfileBookmarkedPosts'
import ProfilePosts from 'components/ProfileSubRoutes/ProfilePosts'
import ProfileComments from 'components/ProfileSubRoutes/ProfileComments'
import ProfileNotifications from 'components/ProfileSubRoutes/ProfileNotifications'
import NotFoundPage from 'pages/NotFoundPage'

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true
  },
  {
    path: '/new-post',
    component: NewPostPage,
    exact: true
  },
  {
    path: '/posts/:id',
    component: PostPage
  },
  {
    path: '/users/:id',
    component: UserPage,
    routes: [
      { path: '/users/:id/posts', component: UserPosts },
      { path: '/users/:id/following-users', component: UserFollowingUsers },
      { path: '/users/:id/followers', component: UserFollowers },
      { path: '/users/:id/comments', component: UserComments }
    ]
  },
  {
    path: '/profile',
    component: ProfilePage,
    routes: [
      { path: '/profile/following-users', component: ProfileFollowingUsers },
      { path: '/profile/followers', component: ProfileFollowers },
      { path: '/profile/bookmarked-posts', component: ProfileBookmarkedPosts },
      { path: '/profile/posts', component: ProfilePosts },
      { path: '/profile/comments', component: ProfileComments },
      { path: '/profile/notifications', component: ProfileNotifications }
    ]
  },
  {
    component: NotFoundPage
  }
]

export const RouteWithSubRoutes = route => (
  <Route
    exact={route.exact}
    path={route.path}
    render={props => (
      // pass the sub-routes down to keep nesting
      <route.component {...props} routes={route.routes} />
    )}
  />
)
