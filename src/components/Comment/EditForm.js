// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { updateComment } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  handleSubmit: Function,
  reset: Function,
  hideEditForm: Function
}

const CommentForm = (props: Props) => {
  const { handleSubmit, reset, hideEditForm } = props

  const handleSubmitAndReset = value => {
    const error = handleSubmit(value)
    !error && reset()
  }

  return <form onSubmit={handleSubmitAndReset} className="mt-md">
      <Field name="content" component="textarea" rows={3} className="f__control mb-md" />
      <button className="btn mr-md" type="button" onClick={hideEditForm}>
        {I18n.action.cancel}
      </button>
      <button className="btn btn--primary" type="submit">
        {I18n.action.comment}
      </button>
    </form>
}

const EditCommentForm = reduxForm({})(CommentForm)

type OwnPropsType = {
  comment: {
    id: string,
    content: string
  },
  hideEditForm: Function
}

const mapStateToProps = (state: Object, ownProps: OwnPropsType) => ({
  form: `EditCommentForm_${ownProps.comment.id}`,
  initialValues: {
    id: ownProps.comment.id,
    content: ownProps.comment.content
  }
})

type CommentType = {
  id: string,
  content: string
}

const mapDispatchToProps = (dispatch: Function, ownProps: OwnPropsType) => ({
  onSubmit: (comment_params: CommentType) => {
    updateComment(comment_params)
    ownProps.hideEditForm()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCommentForm)
