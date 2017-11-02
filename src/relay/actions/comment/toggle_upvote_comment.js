// @flow

import UpvoteCommentMutation from 'relay/mutations/comment/UpvoteCommentMutation'
import UnupvoteCommentMutation from 'relay/mutations/comment/UnupvoteCommentMutation'
import { currentRelay } from 'environment'
import { isUserLogined, showLoginModal } from 'lib/utils'

type CommentType = {
  id: string,
  upvoted: boolean,
  upvote_count: number
}

export const toggleUpvoteComment = (comment: CommentType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }
  
  if (comment.upvoted) {
    UnupvoteCommentMutation.commit({ environment: currentRelay.store, comment })
  } else {
    UpvoteCommentMutation.commit({ environment: currentRelay.store, comment })
  }
}
