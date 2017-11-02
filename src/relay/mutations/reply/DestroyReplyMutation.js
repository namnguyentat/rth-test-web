// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { deleteNode } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation DestroyReplyMutation($input: DestroyReplyInput!) {
    DestroyReply(input: $input) {
      comment {
        id
        reply_count
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

const updater = reply => {
  return store => {
    const payload = store.getRootField('DestroyReply')
    const commentProxy = payload.getLinkedRecord('comment')
    deleteNode({
      proxy: commentProxy,
      id: reply.id,
      connection: 'Replies_replies'
    })
  }
}

function commit(params: { environment: Object, reply: { id: string } }) {
  const { environment, reply } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        id: reply.id,
        clientMutationId: generateClientMutationId(
          'DestroyReplyMutation'
        )
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: true } }),
    updater: updater(reply)
  })
}

export default { commit }
