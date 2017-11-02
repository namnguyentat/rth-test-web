// @flow

import BookmarkPostMutation from 'relay/mutations/post/BookmarkPostMutation'
import UnbookmarkPostMutation from 'relay/mutations/post/UnbookmarkPostMutation'
import { currentRelay } from 'environment'
import { isUserLogined, showLoginModal } from 'lib/utils'

type PostType = {
  id: string,
  bookmarked: boolean
}

export const toggleBookmarkPost = (post: PostType) => {
  if (!isUserLogined()) {
    showLoginModal()
    return false
  }

  if (post.bookmarked) {
    UnbookmarkPostMutation.commit({ environment: currentRelay.store, post })
  } else {
    BookmarkPostMutation.commit({ environment: currentRelay.store, post })
  }
}
