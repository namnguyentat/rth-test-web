// @flow

import {commitMutation, graphql} from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UpdateReplyMutation(
    $input:  UpdateReplyInput!
  ) {
    UpdateReply(input: $input) {
      reply {
        id
        content
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

function getOptimisticResponse(reply) {
  const { id, content } = reply
  return {
    UpdateReply: {
      reply: {
        id,
        content
      }
    }
  }
}

function commit(params: {
  environment: Object,
  reply: {
    id: string,
    content: string
  }
}) {
  const {
    environment,
    reply
  } = params

  const {
    id,
    content,
  } = reply

  return commitMutation(
    environment,
    {
      mutation: mutation,
      variables: {
        input: {
          id,
          content,
          clientMutationId: generateClientMutationId('UpdateReplyMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(reply),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    }
  )
}

export default {commit}
