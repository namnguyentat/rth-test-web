// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { insertEdgeBefore } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation BookmarkPostMutation(
    $input:  BookmarkPostInput!
  ) {
    BookmarkPost(input: $input) {
      post {
        id
        bookmarked
      }
      post_edge {
        __typename
        cursor
        node {
          id
          ...Post_post
        }
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
    BookmarkPost: {
      post: {
        id,
        bookmarked: true,
      }
    }
  }
}

const updater = () => {
  return (store) => {
    const payload = store.getRootField('BookmarkPost')
    const newPostEdge = payload.getLinkedRecord('post_edge')
    const userProxy = payload.getLinkedRecord('current_user')
    insertEdgeBefore({ proxy: userProxy, edge: newPostEdge, connection: 'BookmarkPosts_bookmarked_posts' })
  }
}

function commit(params: {
  environment: Object,
  post: { id: string, bookmarked: boolean }
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
          clientMutationId: generateClientMutationId('BookmarkPostMutation')
        }
      },
      optimisticResponse: getOptimisticResponse(post),
      onError: mutationCallbacks.onError(),
      onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
      updater: updater()
    }
  )
}

export default {commit}
