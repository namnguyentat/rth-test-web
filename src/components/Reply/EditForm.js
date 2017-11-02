// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { updateReply } from 'relay/actions'
import I18n from 'I18n'

type Props = {
  handleSubmit: Function,
  reset: Function,
  hideEditForm: Function
}

const ReplyForm = (props: Props) => {
  const { handleSubmit, reset, hideEditForm } = props

  const handleSubmitAndReset = value => {
    const error = handleSubmit(value)
    !error && reset()
  }

  return (
    <form onSubmit={handleSubmitAndReset} className="mt-md">
      <Field
        name="content"
        component="textarea"
        rows={1}
        className="f__control mb-md"
      />
      <button
        className="btn mr-md btn--small"
        type="button"
        onClick={hideEditForm}
      >
        {I18n.action.cancel}
      </button>
      <button className="btn btn--primary btn--small" type="submit">
        {I18n.action.reply}
      </button>
    </form>
  )
}

const EditReplyForm = reduxForm({})(ReplyForm)

type OwnPropsType = {
  reply: {
    id: string,
    content: string
  },
  hideEditForm: Function
}

const mapStateToProps = (state: Object, ownProps: OwnPropsType) => ({
  form: `EditReplyForm_${ownProps.reply.id}`,
  initialValues: {
    id: ownProps.reply.id,
    content: ownProps.reply.content
  }
})

type ReplyType = {
  id: string,
  content: string
}

const mapDispatchToProps = (dispatch: Function, ownProps: OwnPropsType) => ({
  onSubmit: (reply_params: ReplyType) => {
    updateReply(reply_params)
    ownProps.hideEditForm()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditReplyForm)
