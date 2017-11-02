// @flow

import {commitMutation, graphql} from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UpdateCommentMutation(
    $input:  UpdateCommentInput!
  ) {
    UpdateComment(input: $input) {
      comment {
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

function getOptimisticResponse(comment) {
  const { id, content } = comment
  return {
    UpdateComment: {
      comment: {
        id,
        content
      }
    }
  }
}

function commit(params: {
  environment: Object,
  comment: {
    id: string,
    content: string
  }
}) {
  const {
    environment,
    comment
  } = params

  const {
    id,
    content,
  } = comment

  return commitMutation(
    environment,
    {
      mutation: mutation,
      variables: {
        input: {
          id,
          content,
          clientMutationId: generateClientMutationId('UpdateCommentMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(comment),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    }
  )
}

export default {commit}
