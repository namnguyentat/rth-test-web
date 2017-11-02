// @flow

import DestroySessionMutation from 'relay/mutations/session/DestroySessionMutation'
import { currentRelay } from 'environment'

export const logout = () => {
  DestroySessionMutation.commit({ environment: currentRelay.store })
}
