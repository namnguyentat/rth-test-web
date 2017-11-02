// @flow

import FollowUserMutation from 'relay/mutations/user/FollowUserMutation'
import UnfollowUserMutation from 'relay/mutations/user/UnfollowUserMutation'
import { currentRelay } from 'environment'

type UserType = {
  id: string,
  followed: boolean,
  follower_count: number
}

export const toggleFollowUser = (user: UserType) => {
  if (user.followed) {
    UnfollowUserMutation.commit({ environment: currentRelay.store, user })
  } else {
    FollowUserMutation.commit({ environment: currentRelay.store, user })
  }
}
