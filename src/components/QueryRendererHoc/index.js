// @flow

import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { hideSpinner } from 'reducers/SpinnerReducer'

type Props = {
  readyState: {
    error: ?Object,
    props: ?Object
  },
  // hideSpinner: Function,
  needHideSpinner?: boolean,
  Container: any,
  data: Object
}

class QueryRendererHoc extends Component<Props> {
  componentDidMount() {
    // if (!this.props.spinnerVisible ||  !this.props.needHideSpinner) return

    // if (this.props.readyState.props || this.props.readyState.error) {
    //   this.props.hideSpinner()
    // }
  }

  componentDidUpdate() {
    // if (!this.props.spinnerVisible ||  !this.props.needHideSpinner) return

    // if (this.props.readyState.props || this.props.readyState.error) {
    //   this.props.hideSpinner()
    // }
  }

  render() {
    const { error, props } = this.props.readyState
    const { Container, data } = this.props
    if (error) {
      return <div>{error.message}</div>
    } else if (props) {
      return <Container {...props} {...data} />
    }
    return null
  }
}

export default QueryRendererHoc

// const mapStateToProps = (state: Object) => ({
//   spinnerVisible: state.spinner.visible
// })

// const mapDispatchToProps = (dispatch: Function) => ({
//   hideSpinner: () => dispatch(hideSpinner())
// })

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(QueryRendererHoc)
