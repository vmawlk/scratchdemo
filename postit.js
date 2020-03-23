'use strict'

const pipeline = require('util').promisify(require('stream').pipeline)
const { createReadStream, createWriteStream, lstatSync } = require('fs')
const through2 = require('through2')
const ndjson = require('ndjson')
const { createOutputInvoice } = require('./demo')

const postDocument = async (person, enc, cb) => {
  const filepath = `./testdata/health/doc/${person.id}.pdf`

  console.log(`post document for ${person.id}: ${person.lastname}, ${person.firstname}`)

  try {
    const result = await createOutputInvoice(person, createReadStream(filepath), filepath, 'application/pdf', lstatSync(filepath).size)
    cb(null, result)
  } catch (err) {
    cb(err)
  }
}

const run = async () => {
  await pipeline(
    createReadStream('./testdata/health/health.ndjson'),
    ndjson.parse(),
    through2.obj(postDocument),
    ndjson.stringify(),
    createWriteStream('testids.ndjson'))
}

run()
