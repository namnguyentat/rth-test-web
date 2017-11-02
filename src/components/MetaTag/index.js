// @flow

import React from 'react'
import { Helmet } from 'react-helmet'
import { truncateString } from 'lib/utils'
import Config from 'config'
import I18n from 'I18n'

const MetaTag = ({
  title,
  description,
  image,
  url,
  type
}: {
  title: string,
  description: string,
  image?: string,
  url?: string,
  type?: string
}) => {
  return (
    <Helmet>
      <title lang="en">{`${title} | ${I18n.navigation.brand_name}`}</title>
      <meta name="description" content={truncateString(description, 150)} />
      <meta property="fb:app_id" content={Config.facebook.appId} />
      <meta
        property="og:title"
        content={`${title} | ${I18n.navigation.brand_name}`}
      />
      <meta
        property="og:description"
        content={truncateString(description, 150)}
      />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      {type && <meta property="og:type" content={type} />}
    </Helmet>
  )
}

export default MetaTag
