// @flow

import React from 'react'
import Textarea from 'react-textarea-autosize'

const errorTextStyle = 'text-danger-color text-muted text-italic text-small'

export const TextAreaField = (props: Object) => {
  const {
    input,
    label,
    meta: {
      dirty,
      touched,
      error,
      warning
    },
    helpText,
    ...rest,
  }: {
    input: Object,
    label: string,
    meta: {
      dirty: boolean,
      touched: boolean,
      error: string,
      warning: string,
    },
    helpText?: string,
  } = props

  return (
    <div>
      {(label) && (
        <label htmlFor={input.name}>{label}</label>
      )}
      <div>
        <Textarea {...input} className="f__control" {...rest} id={input.name} />
        <div className="lf">
          <div className="lf_full-space">
            {touched && ((error && <span className={errorTextStyle}>{error}</span>) || (warning && <span>{warning}</span>))}
          </div>
          {(helpText) && <span className="txt-muted txt-small mtxs txt-right txt-italic">{helpText}</span>}
        </div>
      </div>
    </div>
  )
}
