// @flow

import CreatePostCommentMutation from 'relay/mutations/post/CreatePostCommentMutation'
import { currentRelay } from 'environment'
import { isStringEmpty } from 'lib/utils'
import { isUserLogined, showLoginModal } from 'lib/utils'

type Props = {
  post_id: string,
  content: string
}

export const createPostComment = (comment_params: Props) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }

  const { content } = comment_params

  if (isStringEmpty(content)) {
    return false
  }
  CreatePostCommentMutation.commit({
    environment: currentRelay.store,
    comment_params: { ...comment_params, content: content.trim() }
  })
}
