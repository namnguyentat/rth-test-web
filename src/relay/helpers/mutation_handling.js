// @flow

import { createClientLog } from 'lib/client_logs'
import cache from 'environment/cache'
// import { currentRelay } from 'environment'
// import store from 'reduxx'
import { slugify } from 'lib/utils'

export const mutationCallbacks = {
  onError: (options: ?Object) => {
    return (error: Object) => {
      createClientLog(error, {
        file: 'mutation_handling',
        func: 'mutationCallbacks_onError'
      })
    }
  },
  onCompleted: (options: ?Object) => {
    return (response: Object, errors: Object) => {
      if (options && options.cache && options.cache.clear) {
        cache.clear()
      }

      const ret = response[Object.keys(response)[0]].ret
      if (ret && !ret.success) {
        createClientLog(response, {
          file: 'mutation_handling',
          func: 'onCompleted'
        })
        return false
      }

      // Handle custom result
      const mutationType = Object.keys(response)[0]
      switch (mutationType) {
        case 'DestroySession':
          return DestroySessionCallback(response)
        case 'CreateSession':
          return CreateSessionCallback(response)
        case 'CreatePost':
          return CreatePostCallback(response)
        default:
          return false
      }
    }
  }
}

const DestroySessionCallback = (response: Object) => {
  localStorage.removeItem('token')
  localStorage.removeItem('current_user_id')
  window.location.href = '/'
}

const CreateSessionCallback = (response: Object) => {
  localStorage.setItem('token', response.CreateSession.session.access_token)
  localStorage.setItem(
    'current_user_id',
    response.CreateSession.current_user.id
  )
  window.location.reload()
}

const CreatePostCallback = (response: Object) => {
  window.location.href = `/posts/${slugify(
    response.CreatePost.post_edge.node.title
  )}-${response.CreatePost.post_edge.node.id}`
}
