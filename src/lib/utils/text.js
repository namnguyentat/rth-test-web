// @flow

import { createClientLog } from 'lib/utils'

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e')
    .replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i')
    .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o')
    .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u')
    .replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y')
    .replace(/đ/gi, 'd')
    .replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a')
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

export const getIdFromSlug = (text: string) => {
  const parts = text.split('-')
  return parts[parts.length - 1]
}

export const truncateString = (text: string, maxLength: number) => {
  if (!text) return text
  if (text.length < maxLength) return text
  return text.substring(0, maxLength)
}

export const isStringEmpty = (str: string) => {
  if (!str) return true
  return str.toString().trim().length === 0
}

export const isJson = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const convertConstentStateToText = (str: string) => {
  if (!str) return ''

  let rawContent = ''
  try {
    rawContent = JSON.parse(str)
      .blocks.map(block => block.text)
      .join('\n')
  } catch (error) {
    createClientLog(error, {
      file: 'utils_text',
      func: 'convertConstentStateToText'
    })
  }

  return rawContent
}
