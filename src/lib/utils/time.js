// @flow

import { concat } from 'lodash'
import moment from 'moment'

function _select(content: string, part: number, sep: string): Array<string> {
  return content.split(' ')[part].split(sep)
}
export const timeFromNow = (time: string) => {
  // This convert String to Array<Number>:
  // ex: "2017-05-23 03:15:01" => [2017, 04, 23, 3, 15, 1]
  const dateArr = _select(time, 0, '-').map((t, index) => {
    // month in momentjs start from 0
    if (index === 1) return parseInt(t, 10) - 1
    return parseInt(t, 10)
  })

  const timeArr = _select(time, 1, ':').map(t => parseInt(t, 10))

  return moment(concat(dateArr, timeArr)).fromNow()
}