// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    UpdateUser(input: $input) {
      current_user {
        id
        name
        about
        company
        job
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

function commit(params: {
  environment: Object,
  user: { name: string, about: string, company: string, job: string }
}) {
  const { environment, user } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        name: user.name,
        about: user.about,
        company: user.company,
        job: user.job,
        clientMutationId: generateClientMutationId('UpdateUserMutation')
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
