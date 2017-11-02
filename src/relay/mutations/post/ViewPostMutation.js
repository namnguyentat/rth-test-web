// @flow

import {commitMutation, graphql} from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation ViewPostMutation(
    $input:  ViewPostInput!
  ) {
    ViewPost(input: $input) {
      post {
        id
        view_count
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
  const { id, view_count } = post
  return {
    ViewPost: {
      post: {
        id,
        view_count: view_count + 1
      }
    }
  }
}

function commit(params: {
  environment: Object,
  post: { id: string, view_count: number }
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
          clientMutationId: generateClientMutationId('ViewPostMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(post),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted(),
    }
  )
}

export default {commit}
