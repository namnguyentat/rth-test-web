// @flow

import UpvotePostMutation from 'relay/mutations/post/UpvotePostMutation'
import UnupvotePostMutation from 'relay/mutations/post/UnupvotePostMutation'
import { currentRelay } from 'environment'
import { isUserLogined, showLoginModal } from 'lib/utils'

type PostType = {
  id: string,
  upvoted: boolean,
  upvote_count: number
}

export const toggleUpvotePost = (post: PostType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }

  if (post.upvoted) {
    UnupvotePostMutation.commit({ environment: currentRelay.store, post })
  } else {
    UpvotePostMutation.commit({ environment: currentRelay.store, post })
  }
}
