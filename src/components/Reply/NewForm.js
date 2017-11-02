// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { createReply } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  handleSubmit: Function,
  reset: Function
}

const ReplyForm = (props: Props) => {
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
        rows={1}
      />
      <button className="btn btn--primary btn--small" type="submit">
        {I18n.action.reply}
      </button>
    </form>
  )
}

const NewReplyForm = reduxForm({})(ReplyForm)

type OwnPropsType = {
  comment: {
    id: string
  }
}

const mapStateToProps = (state: Object, ownProps: OwnPropsType) => ({
  form: `ReplyForm_${ownProps.comment.id}`,
  initialValues: {
    comment_id: ownProps.comment.id
  }
})

type ReplyType = {
  comment_id: string,
  content: string
}

const mapDispatchToProps = (dispatch: Function) => ({
  onSubmit: (reply: ReplyType) => createReply(reply)
})

export default connect(mapStateToProps, mapDispatchToProps)(NewReplyForm)
