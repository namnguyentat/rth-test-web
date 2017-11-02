// @flow

import React, { Component } from 'react'

type Props = {
  center: any
}

class LayoutTwo extends Component<Props> {
  // shouldComponentUpdate() {
  //   return false
  // }

  render() {
    const { center } = this.props

    return (
      <section className='my-lg grid-container align-self-center'>
        <div className="grid-x grid-padding-x">
          <div className="small-12 large-8 cell">{center}</div>
        </div>
      </section>
    )
  }
}

export default LayoutTwo
