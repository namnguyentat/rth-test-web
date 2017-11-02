// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { deleteNode } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UnfollowUserMutation($input: UnfollowUserInput!) {
    UnfollowUser(input: $input) {
      user {
        id
        followed
        follower_count
      }
      current_user {
        id
        following_user_count
      }
      ret {
        success
        error {
          code
          message
        }
      }
    }
  }
`

function getOptimisticResponse(user) {
  const { id, follower_count } = user
  return {
    UnfollowUser: {
      user: {
        id,
        followed: false,
        follower_count: follower_count - 1
      }
    }
  }
}

const updater = user => {
  return store => {
    const payload = store.getRootField('UnfollowUser')
    const curentUserProxy = payload.getLinkedRecord('current_user')
    deleteNode({
      proxy: curentUserProxy,
      id: user.id,
      connection: 'ProfileFollowingUser_following_users'
    })
  }
}

function commit(params: {
  environment: Object,
  user: { id: string, followed: boolean, follower_count: number }
}) {
  const { environment, user } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        id: user.id,
        clientMutationId: generateClientMutationId('UnfollowUserMutation')
      }
    },
    optimisticResponse: getOptimisticResponse(user),
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater(user)
  })
}

export default { commit }
