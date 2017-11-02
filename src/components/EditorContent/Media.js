// @flow

import React from 'react'

export function customEntityTransform(entity: Object, text: string): string {
  if (entity.type === 'MENTION') {
    return `<a href="${entity.data
      .url}" class="wysiwyg-mention" data-mention data-value="${entity.data
      .value}">${text}</a>`
  }
  if (entity.type === 'LINK') {
    const target = entity.data.target || '_self'
    return `<a href="${entity.data.url}" target="${target}" >${text}</a>`
  }
  if (entity.type === 'IMAGE') {
    return `<img src="${entity.data.src}" alt="image" style="float:${entity.data
      .alignment || 'none'};height: ${entity.data.height};width: ${entity.data
      .width}"/>`
  }
  if (entity.type === 'EMBEDDED_LINK') {
    return `<div class="responsive-embed"><iframe title="video" width="${entity
      .data.width}" height="${entity.data.height}" src="${entity.data
      .src}" frameBorder="0"></iframe></div>`
  }
  return text
}

export function mediaBlockRenderer(block: Object) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false
    }
  }
  return null
}

const Audio = (props: Object) => {
  return <audio controls src={props.src} />
}

const Image = (props: Object) => {
  return (
    <img
      src={props.src}
      alt={props.src}
      style={{
        float: props.alignment || 'none',
        height: props.height,
        width: props.width
      }}
    />
  )
}

const Video = (props: Object) => {
  return <video controls src={props.src} />
}

const Media = (props: Object) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0))

  const { src } = entity.getData()
  const type = entity.getType().toUpperCase()
  let media
  if (type === 'AUDIO') {
    media = <Audio src={src} />
  } else if (type === 'IMAGE') {
    media = (
      <Image
        src={src}
        alignment={entity.data.alignment}
        width={entity.data.width}
        height={entity.data.height}
      />
    )
  } else if (type === 'VIDEO') {
    media = <Video src={src} />
  } else if (type === 'EMBEDDED_LINK') {
    media = (
      <div className="responsive-embed">
        <iframe
          title="video"
          src={src}
          width={entity.data.width}
          height={entity.data.heigth}
          frameBorder="0"
        />
      </div>
    )
  }
  return media
}
