// @flow

import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isEmpty } from 'lodash'
import I18n from 'I18n'
import { logout } from 'relay/actions'
import { isUserLogined } from 'lib/utils'

type Props = {
  showLoginModal: () => void,
  user: {
    id: string,
    name: string,
    avatar: string
  }
}

const DesktopHeader = ({ user, showLoginModal }: Props) => (
  <header className="app-header bg-danger px-md py-sm">
    <Link className="app-header__logo mr-md" to="/">
      <img src="/logo.png" alt={I18n.navigation.brand_name} className="logo" />
    </Link>
    <div className="app-header__menu">
      <nav className="nav">
        <NavLink activeClassName="active" exact className="nav__link" to="/">
          {I18n.navigation.home}
        </NavLink>
        {isUserLogined() && (
          <NavLink
            activeClassName="active"
            className="nav__link"
            to="/profile/posts"
          >
            {I18n.navigation.profile}
          </NavLink>
        )}
        {isUserLogined() && (
          <NavLink
            activeClassName="active"
            className="nav__link"
            to="/new-post"
          >
            {I18n.navigation.new_post}
          </NavLink>
        )}
      </nav>
    </div>
    <div className="app-header__addon">
      <div className="nav">
        {isEmpty(user) && (
          <button onClick={showLoginModal} className="nav__link">
            <i className="fa fa-sign-in" /> {I18n.action.login}
          </button>
        )}
        {user && (
          <Link className="nav__link mr-md" to="/profile">
            {user.name}
          </Link>
        )}
        {user && (
          <button onClick={logout} className="nav__link">
            <i className="fa fa-sign-out" /> {I18n.action.logout}
          </button>
        )}
      </div>
    </div>
  </header>
)

export default DesktopHeader
