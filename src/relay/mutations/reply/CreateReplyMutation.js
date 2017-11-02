// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { insertEdgeBefore } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation CreateReplyMutation($input: CreateReplyInput!) {
    CreateReply(input: $input) {
      comment {
        id
        reply_count
      }
      reply_edge {
        node {
          ...Reply_reply
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

const updater = () => {
  return store => {
    const payload = store.getRootField('CreateReply')
    const newReplyEdge = payload.getLinkedRecord('reply_edge')
    const commentProxy = payload.getLinkedRecord('comment')
    insertEdgeBefore({
      proxy: commentProxy,
      edge: newReplyEdge,
      connection: 'Replies_replies'
    })
  }
}

function commit(params: {
  environment: Object,
  reply: { comment_id: string, content: string }
}) {
  const { environment, reply } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        comment_id: reply.comment_id,
        content: reply.content,
        clientMutationId: generateClientMutationId('CreateReplyMutation')
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater()
  })
}

export default { commit }
