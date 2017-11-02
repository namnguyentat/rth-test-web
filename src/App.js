// @flow

import React, { Component } from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { routes, RouteWithSubRoutes } from './routes'
import Header from 'components/Header'
import ShareBtn from 'components/ShareBtn'
import LoginModal from 'components/Modal/LoginModal'
import './styles/style.css'

type Props = {}

class App extends Component<Props> {
  render() {
    return (
      <Router>
        <div>
          <ShareBtn />
          <Header />
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
          <LoginModal />
        </div>
      </Router>
    )
  }
}

export default App
