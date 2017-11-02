// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { deleteNode } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation DestroyCommentMutation($input: DestroyCommentInput!) {
    DestroyComment(input: $input) {
      commentable {
        ... on Commentable {
          ... on Post {
            id
            comment_count
          }
        }
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

const updater = comment => {
  return store => {
    const payload = store.getRootField('DestroyComment')
    const commentableProxy = payload.getLinkedRecord('commentable')
    deleteNode({
      proxy: commentableProxy,
      id: comment.id,
      connection: 'PostPage_comments'
    })
  }
}

function commit(params: { environment: Object, comment: { id: string } }) {
  const { environment, comment } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        id: comment.id,
        clientMutationId: generateClientMutationId(
          'DestroyCommentMutation'
        )
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater(comment)
  })
}

export default { commit }
