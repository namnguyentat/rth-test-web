// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation DestroySessionMutation($input: DestroySessionInput!) {
    DestroySession(input: $input) {
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

function commit(params: {
  environment: Object
}) {
  const {
    environment,
  } = params

  return commitMutation(
    environment,
    {
      mutation: mutation,
      variables: {
        input: {
          access_token: localStorage.getItem('token'),
          clientMutationId: generateClientMutationId('DestroySessionMutation')
        }
      },
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    }
  )
}

export default {commit}
