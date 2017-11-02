// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UnupvoteCommentMutation($input: UnupvoteCommentInput!) {
    UnupvoteComment(input: $input) {
      comment {
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

function getOptimisticResponse(comment) {
  const { id, upvote_count } = comment
  return {
    UnupvoteComment: {
      comment: {
        id,
        upvoted: false,
        upvote_count: upvote_count - 1
      }
    }
  }
}

function commit(params: {
  environment: Object,
  comment: { id: string, upvoted: boolean, upvote_count: number }
}) {
  const { environment, comment } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        id: comment.id,
        clientMutationId: generateClientMutationId('UnupvoteCommentMutation')
      }
    },
    optimisticResponse: getOptimisticResponse(comment),
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } })
  })
}

export default { commit }
