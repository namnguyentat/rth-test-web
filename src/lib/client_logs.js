// @flow

type Extra = {
  file: string,
  func: string
}

export const createClientLog = (error: Object, extra: Extra) => {
  console.log({ ...error, ...extra })
}
