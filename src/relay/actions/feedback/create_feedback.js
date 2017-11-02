// @flow

import CreateFeedbackMutation from 'relay/mutations/feedback/CreateFeedbackMutation'
import { currentRelay } from 'environment'

type Props = {
  name: string,
  email: string,
  title: string,
  content: string
}

export const createFeedback = (feedback: Props) => {
  CreateFeedbackMutation.commit({
    environment: currentRelay.store,
    feedback
  })
}
