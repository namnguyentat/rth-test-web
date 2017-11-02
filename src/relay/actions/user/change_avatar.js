// @flow

import { upload } from 'lib/firebase'
import ChangeAvatarUserMutation from 'relay/mutations/user/ChangeAvatarUserMutation'
import { currentRelay } from 'environment'
import { createClientLog } from 'lib/utils'

export const changeAvatar = (file: Object) => {
  upload(
    file,
    url => {
      ChangeAvatarUserMutation.commit({
        environment: currentRelay.store,
        user: { avatar: url }
      })
    },
    error => {
      createClientLog(error, { file: 'change_avatar', func: 'changeAvatar' })
    }
  )
}
