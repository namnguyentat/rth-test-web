// @flow

import I18n from 'I18n'
import { isStringEmpty } from 'lib/utils'

window.I18n = I18n

export const required = (value: any) => {
  if (isStringEmpty(value)) {
    return I18n.validation.required
  } else {
    return null
  }
}

export const max_length = (length: number) => {
  return (value: any) => {
    if (value && value.length > length) {
      return I18n.formatString(I18n.validation.too_long, length).join(' ')
    } else {
      return null
    }
  }
}

export const max_length_255 = max_length(255)

export const number_between = ({
  min,
  max
}: {
  min?: number,
  max?: number
}) => {
  return (value: any) => {
    if (!value) return null

    if (!!min) {
      if (value < min) {
        return I18n.formatString(I18n.validation.number_too_small, min).join(
          ' '
        )
      }
    }

    if (!!max) {
      if (value > max) {
        return I18n.formatString(I18n.validation.number_too_large, max).join(
          ' '
        )
      }
    }

    return null
  }
}
