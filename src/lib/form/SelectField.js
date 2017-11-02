// @flow

import React from 'react'

const errorTextStyle = 'text-danger-color text-muted text-italic text-small'

export const SelectField = (props: Object) => {
  const {
    input,
    label,
    meta: {
      dirty,
      touched,
      error,
      warning,
    },
    children,
    name: string,
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
    children: Object,
    name: string,
  } = props
  return (
    <div>
      <label htmlFor={input.name}>{label}</label>
      <div>
        <select {...input} {...rest} id={input.name}>
          {children}
        </select>
        {touched && ((error && <span className={errorTextStyle}>{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}
