// @flow

import React from 'react'

const errorTextStyle = 'text-danger-color text-muted text-italic text-small'

export const InputField = (props: Object) => {
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
        <input {...input} className="f__control" {...rest} id={input.name} />
        {touched && ((error && <span className={errorTextStyle}>{error}</span>) || (warning && <span>{warning}</span>))}
        {(helpText) && <span className="text-muted text-small mtxs text-right text-italic">{helpText}</span>}
      </div>
    </div>
  )
}
