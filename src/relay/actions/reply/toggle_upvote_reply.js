// @flow

import UpvoteReplyMutation from 'relay/mutations/reply/UpvoteReplyMutation'
import UnupvoteReplyMutation from 'relay/mutations/reply/UnupvoteReplyMutation'
import { currentRelay } from 'environment'
import { isUserLogined, showLoginModal } from 'lib/utils'

type ReplyType = {
  id: string,
  upvoted: boolean,
  upvote_count: number
}

export const toggleUpvoteReply = (reply: ReplyType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }
  if (reply.upvoted) {
    UnupvoteReplyMutation.commit({ environment: currentRelay.store, reply })
  } else {
    UpvoteReplyMutation.commit({ environment: currentRelay.store, reply })
  }
}
