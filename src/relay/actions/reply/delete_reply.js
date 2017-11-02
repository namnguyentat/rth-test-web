// @flow

import DestroyReplyMutation from 'relay/mutations/reply/DestroyReplyMutation'
import { currentRelay } from 'environment'

type ReplyType = {
  id: string
}

export const deleteReply = (reply: ReplyType) => {
  DestroyReplyMutation.commit({ environment: currentRelay.store, reply })
}
