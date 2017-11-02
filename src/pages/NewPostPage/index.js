// @flow

import React, { Component } from 'react'
import { reduxForm, Field } from 'redux-form'
import { connect } from 'react-redux'
import I18n from 'I18n'
import { createPost } from 'relay/actions'
import { LayoutOne } from 'layouts/PageLayout'
import HomeSideBar from 'components/HomeSideBar'
import { InputField, TextEditorField } from 'lib/form'
import { required, max_length_255 } from 'lib/form/validator'

type Props = {
  handleSubmit: Function,
  reset: Function
}

class PostModal extends Component<Props> {
  renderMainContent = () => {
    const { handleSubmit, reset } = this.props

    return (
      <form onSubmit={handleSubmit} className="f mb-lg">
        <div className="mb-md">
          <div className="text-bold text-small">{I18n.post.title}:</div>
          <Field
            name="title"
            component={InputField}
            className="f__control"
            validate={[required, max_length_255]}
          />
        </div>
        <div className="mb-md">
          <div className="text-bold text-small">{I18n.post.content}:</div>
          <Field
            name="content"
            component={TextEditorField}
            rows={4}
            className="f__control"
            validate={[required]}
          />
        </div>
        <div className="divider mt-lg mb-md" />
        <div className="d-flex justify-content-end">
          <button type="reset" className="btn mr-md" onClick={reset}>
            {I18n.action.reset}
          </button>
          <button type="submit" className="btn btn--primary">
            {I18n.action.submit}
          </button>
        </div>
      </form>
    )
  }

  render() {
    return (
      <LayoutOne center={this.renderMainContent()} right={<HomeSideBar />} />
    )
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  onSubmit: post => {
    createPost(post)
  }
})

export default connect(mapDispatchToProps)(
  reduxForm({ form: 'PostForm' })(PostModal)
)
