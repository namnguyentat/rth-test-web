// @flow

import RelayQueryResponseCache from 'relay-runtime/lib/RelayQueryResponseCache.js'

const CACHE_TIMEOUT = 5 * 60 * 1000

const cache = new RelayQueryResponseCache({size: 250, ttl: CACHE_TIMEOUT});

export default cache
