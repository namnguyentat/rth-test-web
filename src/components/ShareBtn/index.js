// @flow

import React from 'react'
import { ShareButtons, generateShareIcon } from 'react-share'

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton
} = ShareButtons

const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const GooglePlusIcon = generateShareIcon('google')
const LinkedinIcon = generateShareIcon('linkedin')

const ShareBtn = () => {
  const url = window.location.href

  return (
    <div style={{ position: 'fixed', right: 0, top: '50%', zIndex: 999999 }}>
      <FacebookShareButton url={url}>
        <FacebookIcon size={32} />
      </FacebookShareButton>
      <GooglePlusShareButton url={url}>
        <GooglePlusIcon size={32} />
      </GooglePlusShareButton>
      <TwitterShareButton url={url}>
        <TwitterIcon size={32} />
      </TwitterShareButton>
      <LinkedinShareButton url={url}>
        <LinkedinIcon size={32} />
      </LinkedinShareButton>
    </div>
  )
}

export default ShareBtn
