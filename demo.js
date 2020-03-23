'use strict'

const fetch = require('node-fetch')
const FormData = require('form-data')
const through2 = require('through2')

const CONNECTOR_URL = 'http://127.0.0.1:/custom/p5/output/invoice'
const RETRIEVAL_URL = 'http://127.0.0.1:8080'

class StreamLength {
  constructor () {
    this.length = 0
  }

  get size () {
    return this.length
  }

  stream () {
    return through2((chunk, enc, cb) => {
      this.length += chunk.length

      cb(null, chunk)
    })
  }
}

function createOutputInvoice (person, stream, filename, mimeType, length) {
  const streamLength = new StreamLength()

  const form = new FormData()

  form.append('data', JSON.stringify(person))
  form.append('file', stream.pipe(streamLength.stream()), {
    filename: 'test.pdf',
    contentType: mimeType,
    knownLength: length
  })

  return fetch(CONNECTOR_URL, {
    method: 'post',
    body: form,
    headers: form.getHeaders()
  })
    .then(res => res.json())
    .then(body => ({ id: body && body.id, filesize: streamLength.length }))
}

function searchAllDocuments () {
  return fetch(`${RETRIEVAL_URL}/search`, {
    method: 'post',
    body: JSON.stringify({
      limit: -1,
      query: 'data.invoice.exists()',
      projection: 'id'
    }),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(res => res.json())
    .then(res => res.rows && res.rows.map(r => r.id))
}

function deleteDocument (id) {
  return fetch(`${CONNECTOR_URL}/${id}`, { method: 'delete' })
    .then(res => res.json())
}

module.exports = {
  createOutputInvoice,
  searchAllDocuments,
  deleteDocument
}
