// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation ChangeAvatarUserMutation($input: ChangeAvatarUserInput!) {
    ChangeAvatarUser(input: $input) {
      current_user {
        id
        avatar
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

function commit(params: { environment: Object, user: { avatar: string } }) {
  const { environment, user } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        avatar: user.avatar,
        clientMutationId: generateClientMutationId('ChangeAvatarUserMutation')
      }
    },
    onError: mutationCallbacks.onError({ hideMutationIndicator: true }),
    onCompleted: mutationCallbacks.onCompleted({
      cache: { clear: true },
      hideMutationIndicator: true
    })
  })
}

export default { commit }
