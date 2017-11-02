// @flow

import CreateSessionMutation from 'relay/mutations/session/CreateSessionMutation'
import { currentRelay } from 'environment'
import { createClientLog } from 'lib/client_logs'

export const loginWithGoogleOnSuccess = (response: Object) => {
  const accessToken = response.accessToken
  CreateSessionMutation.commit({
    environment: currentRelay.store,
    data: {
      oauth_access_token: accessToken,
      oauth_type: 'google'
    }
  })
}

type Props = {
  error: string,
  details: string
}

export const loginWithGoogleOnFailure = (props: Props) => {
  createClientLog(
    { ...props },
    {
      file: 'loginWithGoogleOnFailure',
      func: 'login'
    }
  )
}
