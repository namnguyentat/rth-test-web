// @flow

type Extra = {
  file: string,
  func: string
}

export const generateClientMutationId = (type: ?string) => {
  return `${type || 'Mutation'}_${Date.now().toString()}`
}

export const createClientLog = (error: Object, extra: Extra) => {
  console.log({ ...error, ...extra })
}

export const endOfPage = () => {
  const windowYScroll =
    window.pageYOffset ||
    (document.documentElement && document.documentElement.scrollTop) ||
    (document.body && document.body.scrollTop) ||
    0

  return (
    window.innerHeight + windowYScroll + 200 >=
    (document.body && document.body.scrollHeight)
  )
}
