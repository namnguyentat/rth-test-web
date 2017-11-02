// @flow

import React, { Component } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { editorUploadPhotoCallback } from 'lib/firebase'
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  ContentState
} from 'draft-js'
import { isEmpty } from 'lodash'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
// import ImageButton from './CustomComponents/ImageButton'
import EmbeddedButton from './CustomComponents/EmbeddedButton'
import {
  // customEntityTransform,
  mediaBlockRenderer
} from './CustomComponents/Media'
import { isJson } from 'lib/utils'
import { createClientLog } from 'lib/client_logs'

const toolbar = {
  embedded: {
    component: EmbeddedButton
  },
  image: {
    // component: ImageButton,
    // urlEnabled: false,
    uploadEnabled: true,
    uploadCallback: editorUploadPhotoCallback
    // alignmentEnabled: false
  }
}

type Props = {
  input: {
    onChange: Function,
    value: string
  },
  editorStyle?: Object,
  placeholder?: string
}

type State = {
  editorState: EditorState
}
class EditorBase extends Component<Props, State> {
  _getEditorStateFromText: (text: string) => EditorState
  onEditorStateChange: (editorState: EditorState) => void

  constructor(props: Object) {
    super(props)

    this.state = {
      editorState: this._getEditorStateFromText(this.props.input.value)
    }
    this.onEditorStateChange = this.onEditorStateChange.bind(this)
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
      createClientLog(err, { file: 'Editor', func: '_getEditorStateFromText' })
    }

    return EditorState.createWithContent(initialContentState)
  }

  onEditorStateChange(editorState: Object) {
    const contentState = editorState.getCurrentContent()
    this.props.input.onChange(JSON.stringify(convertToRaw(contentState)))
    this.setState({ editorState })
  }

  componentDidUpdate() {
    //  clear editor content when input value is empty
    const inputValue = this.props.input.value
    const editorContentState: ContentState = this.state.editorState.getCurrentContent()
    if (isEmpty(inputValue) && editorContentState.hasText()) {
      this.setState({ editorState: EditorState.createEmpty() })
    }
  }

  render() {
    const { editorState } = this.state
    const { editorStyle, placeholder } = this.props

    return (
      <Editor
        toolbar={toolbar}
        editorState={editorState}
        onEditorStateChange={this.onEditorStateChange}
        editorStyle={
          editorStyle || {
            border: '1px solid #e3e2e1',
            borderRadius: '3px',
            padding: '8px',
            boxSizing: 'border-box',
            minHeight: '150px',
            backgroundColor: '#fff'
          }
        }
        placeholder={placeholder}
        blockRendererFn={mediaBlockRenderer}
      />
    )
  }
}

export default EditorBase
