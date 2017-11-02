// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { insertEdgeBefore } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation CreatePostCommentMutation($input: CreatePostCommentInput!) {
    CreatePostComment(input: $input) {
      post {
        id
        comment_count
      }
      comment_edge {
        __typename
        cursor
        node {
          id
          ...Comment_comment
        }
      }
      current_user {
        id
        comment_count
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

const updater = () => {
  return store => {
    const payload = store.getRootField('CreatePostComment')
    const newCommentEdge = payload.getLinkedRecord('comment_edge')
    const postProxy = payload.getLinkedRecord('post')
    insertEdgeBefore({
      proxy: postProxy,
      edge: newCommentEdge,
      connection: 'PostPage_comments'
    })
  }
}

function commit(params: {
  environment: Object,
  comment_params: { post_id: string, content: string }
}) {
  const { environment, comment_params } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        commentable_id: comment_params.post_id,
        content: comment_params.content,
        clientMutationId: generateClientMutationId('CreatePostCommentMutation')
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater()
  })
}

export default { commit }
