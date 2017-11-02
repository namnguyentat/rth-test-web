// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UnupvoteReplyMutation($input: UnupvoteReplyInput!) {
    UnupvoteReply(input: $input) {
      reply {
        id
        upvoted
        upvote_count
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
  const { id, upvote_count } = reply
  return {
    UnupvoteReply: {
      reply: {
        id,
        upvoted: false,
        upvote_count: upvote_count - 1
      }
    }
  }
}

function commit(params: {
  environment: Object,
  reply: { id: string, upvoted: boolean, upvote_count: number }
}) {
  const { environment, reply } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        id: reply.id,
        clientMutationId: generateClientMutationId('UnupvoteReplyMutation')
      }
    },
    optimisticResponse: getOptimisticResponse(reply),
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } })
  })
}

export default { commit }
