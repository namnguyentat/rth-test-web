// @flow

import CreatePostMutation from 'relay/mutations/post/CreatePostMutation'
import { currentRelay } from 'environment'

type Props = {
  title: string,
  content: string
}

export const createPost = (post: Props) => {
  CreatePostMutation.commit({
    environment: currentRelay.store,
    post
  })
}
