// @flow

import React, { Component } from 'react'

type Props = {
  children: any
}

class Main extends Component<Props> {
  // shouldComponentUpdate() {
  //   return false
  // }

  render() {
    return (
      <main className="container">
        {this.props.children}
      </main>
    )
  }
}

export default Main
