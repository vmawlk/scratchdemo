'use strict'

const { searchAllDocuments, deleteDocument } = require('./demo')

searchAllDocuments()
  .then(docIds => Promise.all(docIds.map(docId => deleteDocument(docId))))
  .then(result => console.log(`deleted: ${result.length} documents`))
