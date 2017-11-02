// @flow

import { commitMutation, graphql } from 'react-relay'
import { generateClientMutationId } from 'lib/utils'
import { insertEdgeBefore } from 'relay/helpers/utils'
import { mutationCallbacks } from 'relay/helpers/mutation_handling'

const mutation = graphql`
  mutation CreatePostMutation($input: CreatePostInput!) {
    CreatePost(input: $input) {
      ret {
        success
        error {
          code
          message
        }
      }
      current_user {
        id
        post_count
      }
      post_edge {
        node {
          id
          title
          ...Post_post
        }
      }
    }
  }
`

const updater = () => {
  return store => {
    const payload = store.getRootField('CreatePost')
    const newPostEdge = payload.getLinkedRecord('post_edge')
    const viewerProxy = store.get('client:root:viewer')
    const currentUserProxy = payload.getLinkedRecord('current_user')
    insertEdgeBefore({
      proxy: currentUserProxy,
      edge: newPostEdge,
      connection: 'ProfilePosts_posts'
    })
    insertEdgeBefore({
      proxy: viewerProxy,
      edge: newPostEdge,
      connection: 'HomePage_posts'
    })
  }
}

function commit(params: {
  environment: Object,
  post: { title: string, content: string }
}) {
  const { environment, post } = params

  return commitMutation(environment, {
    mutation: mutation,
    variables: {
      input: {
        title: post.title,
        content: post.content,
        clientMutationId: generateClientMutationId('CreatePostMutation')
      }
    },
    onError: mutationCallbacks.onError(),
    onCompleted: mutationCallbacks.onCompleted({ cache: { clear: false } }),
    updater: updater()
  })
}

export default { commit }
