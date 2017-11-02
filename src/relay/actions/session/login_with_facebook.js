// @flow

import CreateSessionMutation from 'relay/mutations/session/CreateSessionMutation'
import { currentRelay } from 'environment'

declare var FB: Object

export const loginWithFacebook = () => {
  FB.login( // eslint-disable-line no-undef
    response => {
      const accessToken = response.authResponse.accessToken
      CreateSessionMutation.commit({
        environment: currentRelay.store,
        data: {
          oauth_access_token: accessToken,
          oauth_type: 'facebook'
        }
      })
    },
    { scope: 'email, public_profile, user_friends' }
  )
}
