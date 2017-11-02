// @flow

import { EditorState, ContentState, convertFromRaw } from 'draft-js'
import htmlToDraft from 'html-to-draftjs'
import { createClientLog } from 'lib/utils'
import { isJson } from 'lib/utils'
import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { isEmpty } from 'lodash'
import { mediaBlockRenderer } from './Media'

type Props = {
  content: string
}

class EditorContent extends Component<Props> {
  _getEditorStateFromText: (text: string) => EditorState

  constructor(props: Object) {
    super(props)

    this._getEditorStateFromText = this._getEditorStateFromText.bind(this)
  }

  _getEditorStateFromText(text: string) {
    let content = null
    let initialContentState = null

    try {
      if (isEmpty(text)) {
        initialContentState = ContentState.createFromText('')
      } else if (isJson(text)) {
        content = JSON.parse(text)
        initialContentState = convertFromRaw(content)
      } else {
        const blocksFromHTML = htmlToDraft(text)
        const contentBlocks = blocksFromHTML.contentBlocks
        initialContentState = ContentState.createFromBlockArray(contentBlocks)
      }
    } catch (err) {
      initialContentState = ContentState.createFromText('')
      createClientLog(err, {
        file: 'EditorContent',
        func: '_getEditorStateFromText'
      })
    }

    return EditorState.createWithContent(initialContentState)
  }

  render() {
    const { content } = this.props
    const editorState = this._getEditorStateFromText(content)

    return (
      <Editor
        editorClassName='editor-content'
        editorState={editorState}
        readOnly={true}
        toolbarStyle={{ display: 'none' }}
        blockRendererFn={mediaBlockRenderer}
      />
    )
  }
}

export default EditorContent
