// @flow

import UpdateReplyMutation from 'relay/mutations/reply/UpdateReplyMutation'
import { currentRelay } from 'environment'
import { isStringEmpty } from 'lib/utils'
import { isUserLogined, showLoginModal } from 'lib/utils'

type ReplyType = {
  id: string,
  content: string
}

export const updateReply = (reply: ReplyType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }
  
  const { content, id } = reply

  if (isStringEmpty(content)) {
    return false
  }

  UpdateReplyMutation.commit({
    environment: currentRelay.store,
    reply: {
      content: content.trim(),
      id
    }
  })
}
