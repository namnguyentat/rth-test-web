// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType } from 'flow-type'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog } from 'lib/utils'
import { isEmpty } from 'lodash'
import Reply from 'components/Reply'
import LoginPromt from 'components/LoginPromt'
import NewReplyForm from 'components/Reply/NewForm'
import I18n from 'I18n'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: ?{
      id: string
    }
  },
  comment: {
    id: string,
    replies: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  }
}

class RepliesView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, { file: 'Replies', func: 'fetchMore' })
      }
    })
  }

  render() {
    const { comment, viewer } = this.props
    const { current_user } = viewer
    const replies = comment.replies.edges.map(edge => edge.node)

    return (
      <div className="ml-xl mt-md">
        {current_user ? (
          <NewReplyForm comment={comment} />
        ) : (
          <LoginPromt text={I18n.action.login_to_reply} />
        )}

        <div className="mt-md mb-md">
          {replies.map(reply => (
            <Reply key={reply.id} reply={reply} current_user={current_user} />
          ))}
        </div>
        {this.props.relay.hasMore() && (
          <div className="text-center">
            <button
              className="btn btn--text text-primary text-small"
              onClick={this.fetchMore}
            >
              <i className="fa fa-plus-square" /> {I18n.action.load_more}
            </button>
          </div>
        )}
      </div>
    )
  }
}

const Replies = createPaginationContainer(
  RepliesView,
  {
    viewer: graphql`
      fragment Replies_viewer on Viewer {
        current_user {
          id
          ...Reply_current_user
        }
      }
    `,
    comment: graphql`
      fragment Replies_comment on Comment {
        id
        replies(first: $count, after: $cursor)
          @connection(key: "Replies_replies") {
          edges {
            node {
              id
              ...Reply_reply
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
  },
  {
    direction: 'forward',
    getConnectionFromProps(props) {
      return props.comment && props.comment.replies
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        id: fragmentVariables.id,
        count,
        cursor
      }
    },
    query: graphql`
      query RepliesPaginationQuery(
        $id: GlobalIdInput!
        $count: Int!
        $cursor: String
      ) {
        viewer {
          ...Replies_viewer
        }
        comment(id: $id) {
          ...Replies_comment @arguments(id: $id)
        }
      }
    `
  }
)

export default (data: { commentId: string }) => {
  return (
    <QueryRenderer
      environment={currentRelay.store}
      query={graphql`
        query RepliesQuery($id: GlobalIdInput!, $count: Int, $cursor: String) {
          viewer {
            ...Replies_viewer
          }
          comment(id: $id) {
            ...Replies_comment @arguments(id: $id)
          }
        }
      `}
      variables={{
        id: data.commentId,
        count: DEFAULT_LOAD_SIZE
      }}
      render={(readyState: Object) => {
        return (
          <QueryRendererHoc
            needHideSpinner
            readyState={readyState}
            data={data}
            Container={Replies}
          />
        )
      }}
    />
  )
}
