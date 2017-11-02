// @flow

import ViewPostMutation from 'relay/mutations/post/ViewPostMutation'
import { currentRelay } from 'environment'

type PostType = {
  id: string,
  view_count: number
}

export const viewPost = (post: PostType) => {
  ViewPostMutation.commit({ environment: currentRelay.store, post })
}
