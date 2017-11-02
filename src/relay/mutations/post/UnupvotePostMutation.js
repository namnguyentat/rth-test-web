// @flow

import {commitMutation, graphql} from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UnupvotePostMutation(
    $input:  UnupvotePostInput!
  ) {
    UnupvotePost(input: $input) {
      post {
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

function getOptimisticResponse(post) {
  const { id, upvote_count } = post
  return {
    UnupvotePost: {
      post: {
        id,
        upvoted: false,
        upvote_count: upvote_count - 1
      }
    }
  }
}

function commit(params: {
  environment: Object,
  post: { id: string, upvoted: boolean, upvote_count: number}
}) {
  const {
    environment,
    post
  } = params

  return commitMutation(
    environment,
    {
      mutation: mutation,
      variables: {
        input: {
          id: post.id,
          clientMutationId: generateClientMutationId('UnupvotePostMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(post),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    }
  )
}

export default {commit}
