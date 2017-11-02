// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation CreateSessionMutation($input: CreateSessionInput!) {
    CreateSession(input: $input) {
      ret {
        success
        error {
          code
          message
        }
      }
      session {
        access_token
      }
      current_user {
        id
      }
    }
  }
`

function commit(params: {
  environment: Object,
  data: { oauth_access_token: string, oauth_type: string },
}) {
  const {
    environment,
    data,
  } = params

  return commitMutation(
    environment,
    {
      mutation: mutation,
      variables: {
        input: {
          oauth_access_token: data.oauth_access_token,
          oauth_type: data.oauth_type,
          clientMutationId: generateClientMutationId('CreateSessionMutation')
        }
      },
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    }
  )
}

export default {commit}
