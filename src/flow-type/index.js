// @flow

export type EventTargetType = {
  currentTarget: {
    value: string,
    classList: {
      add: (v: string) => void,
      remove: (v: string) => void
    }
  },
  preventDefault: () => void
};

export type RelayType = {
  loadMore: (size: number, errorFunc: (error: Object) => void) => void,
  hasMore: () => boolean,
  isLoading: () => boolean,
  refetch: (
    refetchVariables: Object,
    renderVariables: ?Object,
    callback?: ?Object,
    options?: ?Object
  ) => void
};

export type UserType = {
  answer_count: number,
  avatar: string,
  email: string,
  follower_count: number,
  name: string,
  about: string,
  following_user_count: number,
  bookmark_post_count: number,
  bookmark_review_count: number,
  unseen_notification_count: number,
  followed: boolean,
  notification_mode: string,
  onboarding: string,
  prefered_language: string,
  roles: Array<string>,
  following_users: Object,
  notifications: Object
}

export type RouterParamType = {
  history: {
    lengh: number,
    action: string,
    location: {
      pathname: string,
      search: string,
      hash: string,
    }
  },
  location: {
    pathname: string,
    search: string,
    hash: string,
  },
  match: {
    isExact: boolean,
    paht: string,
    params: Object,
    url: string
  }

}