// @flow

import React, { Component } from 'react'
import { graphql, createPaginationContainer, QueryRenderer } from 'react-relay'
import { isEmpty } from 'lodash'
import { currentRelay } from 'environment'
import QueryRendererHoc from 'components/QueryRendererHoc'
import type { RelayType } from 'flow-type'
import { DEFAULT_LOAD_SIZE } from 'constants/index'
import { createClientLog, endOfPage } from 'lib/utils'
import Post from 'components/Post'
import HomeSideBar from 'components/HomeSideBar'
import MetaTag from 'components/MetaTag'
import I18n from 'I18n'
import { LayoutOne } from 'layouts/PageLayout'

type Props = {
  relay: RelayType,
  viewer: {
    current_user: ?{
      id: string
    },
    posts: {
      edges: Array<{
        node: {
          id: string
        }
      }>
    }
  }
}

class HomePageView extends Component<Props> {
  fetchMore = () => {
    if (!this.props.relay.hasMore() || this.props.relay.isLoading()) return null

    this.props.relay.loadMore(DEFAULT_LOAD_SIZE, error => {
      if (!isEmpty(error)) {
        createClientLog(error, { file: 'HomePage', func: 'fetchMore' })
      }
    })
  }

  renderMainContent = (posts, current_user) => (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} current_user={current_user} />
      ))}
      {endOfPage() && this.fetchMore()}
      <MetaTag
        title={I18n.meta_tag.home.title}
        description={I18n.meta_tag.home.description}
        image={I18n.meta_tag.home.image}
      />
    </div>
  )

  scrollHandler = (e: Event) => {
    endOfPage() && this.fetchMore()
  }

  componentWillMount() {
    window.addEventListener('scroll', this.scrollHandler)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler)
  }

  render() {
    const { viewer } = this.props
    const { current_user } = viewer
    const posts = viewer.posts.edges.map(edge => edge.node)

    return (
      <LayoutOne
        center={this.renderMainContent(posts, current_user)}
        right={<HomeSideBar />}
      />
    )
  }
}

const HomePage = createPaginationContainer(
  HomePageView,
  {
    viewer: graphql`
      fragment HomePage_viewer on Viewer {
        current_user {
          id
          ...Post_current_user
        }
        posts(first: $count, after: $cursor)
          @connection(key: "HomePage_posts") {
          edges {
            node {
              id
              ...Post_post
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
      return props.viewer.posts
    },
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount
      }
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor
      }
    },
    query: graphql`
      query HomePagePaginationQuery($count: Int!, $cursor: String) {
        viewer {
          ...HomePage_viewer
        }
      }
    `
  }
)

export default (data: Object) => (
  <QueryRenderer
    environment={currentRelay.store}
    query={graphql`
      query HomePageQuery($count: Int, $cursor: String) {
        viewer {
          ...HomePage_viewer
        }
      }
    `}
    variables={{
      count: DEFAULT_LOAD_SIZE
    }}
    render={(readyState: Object) => {
      return (
        <QueryRendererHoc
          needHideSpinner
          readyState={readyState}
          data={data}
          Container={HomePage}
        />
      )
    }}
  />
)
