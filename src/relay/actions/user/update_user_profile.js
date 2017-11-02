// @flow

import UpdateUserMutation from 'relay/mutations/user/UpdateUserMutation'
import { currentRelay } from 'environment'

type UserType = {
  name: string,
  about: string,
  company: string,
  job: string
}

export const updateUserProfile = (user: UserType) => {
  UpdateUserMutation.commit({ environment: currentRelay.store, user })
}
