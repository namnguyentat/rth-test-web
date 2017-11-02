// @flow

import CreateReplyMutation from 'relay/mutations/reply/CreateReplyMutation'
import { currentRelay } from 'environment'
import { isStringEmpty } from 'lib/utils'
import { isUserLogined, showLoginModal } from 'lib/utils'

type Props = {
  comment_id: string,
  content: string
}

export const createReply = (reply: Props) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }
  
  const { content } = reply

  if (isStringEmpty(content)) {
    return false
  }

  CreateReplyMutation.commit({
    environment: currentRelay.store,
    reply: { ...reply, content: content.trim() }
  })
}
