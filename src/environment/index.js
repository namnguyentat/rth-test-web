// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime'
import Config from 'config'
import cache from './cache'
import { FETCH_TIME_OUT } from 'constants/index'
import { createClientLog } from 'lib/client_logs'

let currentRelay = {}

function timeoutPromise(ms, promise) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout'))
    }, ms)
    promise.then(
      res => {
        clearTimeout(timeoutId)
        resolve(res)
      },
      err => {
        clearTimeout(timeoutId)
        reject(err)
      }
    )
  })
}

currentRelay['reset'] = () => {
  function fetchQuery(operation, variables, cacheConfig) {
    const queryID = operation.name

    if (!cacheConfig || !cacheConfig.force) {
      const data = cache.get(queryID, variables)
      if (data !== null) return Promise.resolve(data) // cache hit
    }

    const token: ?string = localStorage.getItem('token')
    const headers: Object = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return timeoutPromise(
      FETCH_TIME_OUT,
      fetch(`${Config.apiUrl}/queries`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          query: operation.text, // GraphQL text from input
          variables
        })
      })
    )
      .then((response: Object) => {
        return response.json()
      })
      .then((jsonPayload: Object) => {
        if (!cacheConfig || !cacheConfig.force) {
          cache.set(queryID, variables, jsonPayload)
        }
        return Promise.resolve(jsonPayload)
      })
      .catch(error =>
        createClientLog(error, { file: 'environemnt', func: 'fetchQuery' })
      )
  }

  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery)

  const source = new RecordSource()
  const store = new Store(source)

  currentRelay.store = new Environment({
    network,
    store
  })
}

currentRelay.reset()

export { currentRelay }
