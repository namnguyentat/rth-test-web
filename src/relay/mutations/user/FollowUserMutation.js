// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation FollowUserMutation($input: FollowUserInput!) {
    FollowUser(input: $input) {
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
    FollowUser: {
      user: {
        id,
        followed: true,
        follower_count: follower_count + 1
      }
    }
  }
}

const updater = () => {
  return store => {
    // const payload = store.getRootField('FollowUser')
    // const userProxy = payload.getLinkedRecord('current_user')
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
        clientMutationId: generateClientMutationId('FollowUserMutation')
      }
    },
    optimisticResponse: getOptimisticResponse(user),
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater()
  })
}

export default { commit }
