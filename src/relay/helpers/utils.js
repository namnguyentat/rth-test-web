// @flow

import { ConnectionHandler } from 'relay-runtime'

export const convertToValidTopicInput = (topics: Array<Object>) => {
  if (!topics) return []
  return topics.map(topic => {
    if (topic.value === topic.label) {
      return { name: topic.value }
    } else {
      return { id: topic.value, name: topic.label }
    }
  })
}

export const convertToValidWordListInput = (words: Array<Object>) => {
  if (!words) return []
  return words.map(word => ({ id: word.value }))
}

export const insertEdgeBefore = ({
  proxy,
  edge,
  connection
}: {
  proxy: Object,
  edge: Object,
  connection: string
}) => {
  if (!(proxy && edge && connection)) return

  const conn = ConnectionHandler.getConnection(proxy, connection)

  if (!conn) return
  ConnectionHandler.insertEdgeBefore(conn, edge)
}

export const insertEdgeAfter = ({
  proxy,
  edge,
  connection
}: {
  proxy: Object,
  edge: Object,
  connection: string
}) => {
  if (!(proxy && edge && connection)) return

  const conn = ConnectionHandler.getConnection(proxy, connection)

  if (!conn) return
  ConnectionHandler.insertEdgeBefore(conn, edge)
}

export const deleteNode = ({
  proxy,
  id,
  connection
}: {
  proxy: Object,
  id: string,
  connection: string
}) => {
  if (!(proxy && id && connection)) return

  const conn = ConnectionHandler.getConnection(proxy, connection)

  if (!conn) return
  ConnectionHandler.deleteNode(conn, id)
}

const EDGES = 'edges'
const NODE = 'node'

export const deleteCustomNode = ({
  proxy,
  id,
  connection,
  nodeName
}: {
  proxy: Object,
  id: string,
  connection: string,
  nodeName: string
}) => {
  if (!(proxy && id && connection && nodeName)) return

  const conn = ConnectionHandler.getConnection(proxy, connection)

  if (!conn) return

  var edges = conn.getLinkedRecords(EDGES)
  if (!edges) {
    return
  }
  var nextEdges = void 0
  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii]
    var node = edge && edge.getLinkedRecord(NODE)
    const deltedNode = node && node.getLinkedRecord(nodeName)
    if (deltedNode != null && deltedNode.getDataID() === id) {
      if (nextEdges === undefined) {
        nextEdges = edges.slice(0, ii)
      }
    } else if (nextEdges !== undefined) {
      nextEdges.push(edge)
    }
  }
  if (nextEdges !== undefined) {
    conn.setLinkedRecords(nextEdges, EDGES)
  }
}

export const deleteMultiCustomNode = ({
  proxy,
  id,
  connection,
  nodeNames
}: {
  proxy: Object,
  id: string,
  connection: string,
  nodeNames: Array<string>
}) => {
  if (!(proxy && id && connection && nodeNames)) return

  const conn = ConnectionHandler.getConnection(proxy, connection)

  if (!conn) return

  var edges = conn.getLinkedRecords(EDGES)
  if (!edges) {
    return
  }
  var nextEdges = void 0
  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii]
    var node = edge && edge.getLinkedRecord(NODE)

    var realNode = node
    for (var iii = 0; iii < nodeNames.length; iii++) {
      realNode = realNode && realNode.getLinkedRecord(nodeNames[iii])
    }

    if (realNode != null && realNode.getDataID() === id) {
      if (nextEdges === undefined) {
        nextEdges = edges.slice(0, ii)
      }
    } else if (nextEdges !== undefined) {
      nextEdges.push(edge)
    }
  }
  if (nextEdges !== undefined) {
    conn.setLinkedRecords(nextEdges, EDGES)
  }
}
