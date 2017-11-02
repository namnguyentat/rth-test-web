// @flow

import React from 'react'
import Editor from 'components/Editor'

const errorTextStyle = 'text-danger-color text-muted text-italic text-small'

export const TextEditorField = (props: Object) => {
  const {
    input,
    label,
    type,
    style,
    meta: {
      dirty,
      touched,
      error,
      warning
    },
    ...rest,
  }: {
    input: Object,
    label: string,
    type: string,
    style: Object,
    meta: {
      dirty: boolean,
      touched: boolean,
      error: string,
      warning: string,
    }
  } = props

  return (
    <div>
      {(label) && (
        <label htmlFor={input.name}>{label}</label>
      )}
      <div>
        <Editor input={input} {...rest} id={input.name} />
        {touched && ((error && <span className={errorTextStyle}>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}
