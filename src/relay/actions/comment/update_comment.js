// @flow

import UpdateCommentMutation from 'relay/mutations/comment/UpdateCommentMutation'
import { currentRelay } from 'environment'
import { isStringEmpty } from 'lib/utils'
import { isUserLogined, showLoginModal } from 'lib/utils'

type CommentType = {
  id: string,
  content: string
}

export const updateComment = (comment: CommentType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }

  const { content, id } = comment

  if (isStringEmpty(content)) {
    return false
  }

  UpdateCommentMutation.commit({
    environment: currentRelay.store,
    comment: {
      content: content.trim(),
      id
    }
  })
}
