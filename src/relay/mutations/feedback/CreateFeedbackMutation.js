// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation CreateFeedbackMutation($input: CreateFeedbackInput!) {
    CreateFeedback(input: $input) {
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
  feedback: { name: string, email: string, title: string, content: string }
}) {
  const { environment, feedback } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        name: feedback.name,
        email: feedback.email,
        title: feedback.title,
        content: feedback.content,
        clientMutationId: generateClientMutationId('CreateFeedbackMutation')
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: false } })
  })
}

export default { commit }
