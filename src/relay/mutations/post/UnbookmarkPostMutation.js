// @flow

import {commitMutation, graphql} from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { deleteNode } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation UnbookmarkPostMutation(
    $input:  UnbookmarkPostInput!
  ) {
    UnbookmarkPost(input: $input) {
      post {
        id
        bookmarked
      }
      current_user {
        id
        bookmark_post_count
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
  const { id } = post
  return {
    UnbookmarkPost: {
      post: {
        id,
        bookmarked: false,
      }
    }
  }
}

const updater = (post) => {
  return (store) => {
    const payload = store.getRootField('UnbookmarkPost')
    const userProxy = payload.getLinkedRecord('current_user')
    deleteNode({ proxy: userProxy, id: post.id, connection: 'BookmarkPosts_bookmarked_posts' })
  }
}

function commit(params: {
  environment: Object,
  post: { id: string, bookmarked: boolean },
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
          clientMutationId: generateClientMutationId('UnbookmarkPostMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(post),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
      updater: updater(post)
    }
  )
}

export default {commit}
