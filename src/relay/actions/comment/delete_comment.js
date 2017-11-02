// @flow

import DestroyCommentMutation from 'relay/mutations/comment/DestroyCommentMutation'
import { currentRelay } from 'environment'

type CommentType = {
  id: string
}

export const deleteComment = (comment: CommentType) => {
  DestroyCommentMutation.commit({ environment: currentRelay.store, comment })
}
