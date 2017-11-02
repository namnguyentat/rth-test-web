// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { createPostComment } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  handleSubmit: Function,
  reset: Function
}

const CommentForm = (props: Props) => {
  const { handleSubmit, reset } = props

  const handleSubmitAndReset = value => {
    const error = handleSubmit(value)
    !error && reset()
  }

  return (
    <form onSubmit={handleSubmitAndReset}>
      <Field
        name="content"
        component="textarea"
        className="f__control mb-md"
        rows={3}
      />
      <button className="btn btn--primary" type="submit">
        {I18n.action.comment}
      </button>
    </form>
  )
}

const NewCommentForm = reduxForm({})(CommentForm)

type OwnPropsType = {
  post: {
    id: string
  }
}

const mapStateToProps = (state: Object, ownProps: OwnPropsType) => ({
  form: `CommentForm_${ownProps.post.id}`,
  initialValues: {
    post_id: ownProps.post.id
  }
})

type CommentType = {
  post_id: string,
  content: string
}

const mapDispatchToProps = (dispatch: Function) => ({
  onSubmit: (comment_params: CommentType) => createPostComment(comment_params)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewCommentForm)
