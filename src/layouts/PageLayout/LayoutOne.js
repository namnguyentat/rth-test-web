// @flow

import React, { Component } from 'react'

type Props = {
  right: any,
  center: any
}

class LayoutOne extends Component<Props> {
  // shouldComponentUpdate() {
  //   return false
  // }

  render() {
    const { right, center } = this.props

    return (
      <div className="grid-container my-lg">
        <div className="grid-x grid-padding-x">
          <section className="large-8 cell">{center}</section>
          <aside className="large-4 cell">{right}</aside>
        </div>
      </div>
    )
  }
}

export default LayoutOne
