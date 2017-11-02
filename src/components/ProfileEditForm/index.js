// @flow

import React from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { updateUserProfile } from 'relay/actions'
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

  return (
    <form onSubmit={handleSubmitAndReset}>
      <div className="mb-md">
        <div className="mb-md">
          <label htmlFor="name">{I18n.profile.name}</label>
          <Field
            id="name"
            name="name"
            component="input"
            className="f__control"
            required
          />
        </div>
        <div className="mb-md">
          <label htmlFor="about">{I18n.profile.about}</label>
          <Field
            id="about"
            name="about"
            component="input"
            className="f__control"
            required
          />
        </div>
        <div className="mb-md">
          <label htmlFor="company">{I18n.profile.company}</label>
          <Field
            id="company"
            name="company"
            component="input"
            className="f__control"
          />
        </div>
        <div className="mb-md">
          <label htmlFor="job">{I18n.profile.job}</label>
          <Field id="job" name="job" component="input" className="f__control" />
        </div>
      </div>
      <button className="btn mr-md" type="button" onClick={hideEditForm}>
        {I18n.action.cancel}
      </button>
      <button className="btn btn--primary" type="submit">
        {I18n.action.edit}
      </button>
    </form>
  )
}

const ProfileEditForm = reduxForm({})(CommentForm)

type OwnPropsType = {
  current_user: {
    id: string,
    avatar: string,
    name: string,
    about: string,
    company: string,
    job: string
  },
  hideEditForm: Function
}

const mapStateToProps = (state: Object, ownProps: OwnPropsType) => {
  const { current_user } = ownProps

  return {
    form: `ProfileEditForm`,
    initialValues: {
      // avatar: current_user.avatar,
      name: current_user.name,
      about: current_user.about,
      company: current_user.company,
      job: current_user.job
    }
  }
}

type UserType = {
  // avatar: string,
  name: string,
  email: string,
  about: string,
  company: string,
  job: string
}

const mapDispatchToProps = (dispatch: Function, ownProps: OwnPropsType) => ({
  onSubmit: (user: UserType) => {
    updateUserProfile(user)
    ownProps.hideEditForm()
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditForm)
