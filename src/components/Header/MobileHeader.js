// @flow

import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isEmpty } from 'lodash'
import cx from 'classnames'
import I18n from 'I18n'
import { logout } from 'relay/actions'
import { isUserLogined } from 'lib/utils'
import withToggle from 'hocs/withToggle'

type Props = {
  showLoginModal: () => void,
  user: {
    id: string,
    name: string,
    avatar: string
  },
  isShow: boolean,
  toggle: () => void
}

const MobileHeader = ({ user, showLoginModal, isShow, toggle }: Props) => (
  <header className="app-m-header bg-danger px-md py-sm">
    <div className="d-flex align-items-center">
      <Link className="app-m-header__logo" to="/">
        <img
          src="/logo.png"
          alt={I18n.navigation.brand_name}
          className="logo"
        />
      </Link>
      <div className="item-fullfill" />
      <button className="app-m-header__toggle" type="button" onClick={toggle}>
        <i
          className={cx('fa fa-lg', { 'fa-bars': !isShow, 'fa-times': isShow })}
        />
      </button>
    </div>
    {isShow && (
      <div className="app-m-header__menu mt-md">
        <nav className="nav">
          <div>
            <NavLink
              activeClassName="active"
              exact
              className="nav__link py-sm"
              to="/"
            >
              {I18n.navigation.home}
            </NavLink>
          </div>
          <div>
            {isUserLogined() && (
              <NavLink
                activeClassName="active"
                className="nav__link py-sm"
                to="/profile/posts"
              >
                {I18n.navigation.profile}
              </NavLink>
            )}
          </div>
          <div>
            {isUserLogined() && (
              <NavLink
                activeClassName="active"
                className="nav__link py-sm"
                to="/new-post"
              >
                {I18n.navigation.new_post}
              </NavLink>
            )}
          </div>
          <div>
            {isEmpty(user) && (
              <button onClick={showLoginModal} className="nav__link pysm">
                <i className="fa fa-sign-in" /> {I18n.action.login}
              </button>
            )}
          </div>
          <div>
            {user && (
              <Link className="nav__link py-sm" to="/profile">
                {user.name}
              </Link>
            )}
          </div>
          <div>
            {user && (
              <button onClick={logout} className="nav__link py-sm">
                <i className="fa fa-sign-out" /> {I18n.action.logout}
              </button>
            )}
          </div>
        </nav>
      </div>
    )}
  </header>
)

export default withToggle(MobileHeader)
