'use strict'

/**
 * Module Dependencies
 */

let fmt = require('./lib/format-message')
let Producer = require('glossy').Produce
let write = require('stream-write')
let through = require('through2')
let parse = require('url').parse
let tcp = require('./lib/net')
let os = require('os')

/**
 * Export `Papertrail`
 */

module.exports = Papertrail

/**
 * Export `Papertrail`
 *
 * @param {String} uri
 * @return {Stream}
 */

function Papertrail (uri, options) {
  options = options || {}

  // uri
  if (!~uri.indexOf('://')) uri = 'http://' + uri
  let scheme = parse(uri)

  // assertions
  if (!scheme.hostname || !scheme.port) {
    throw new Error('Invalid url: hostname and port are required')
  }

  // options
  let keepalive = options.keepalive || 15000
  let producer = new Producer({ facility: 'daemon' })
  let stream = null
  let buffer = []

  // connect to Papertrail
  tcp(scheme.port, scheme.hostname, function(connection) {
    stream = connection
    if (connection && buffer.length) {
      for (let i = 0, buf; buf = buffer[i]; i++) {
        write(stream, format(producer, scheme, buf[0]), function(err) {
          if (err) return buf[1](err)
          buf[1](null, buf[0])
        })
      }
      buffer = []
    }
  })

  return through.obj(function (chunk, enc, fn) {
    if (stream) {
      write(stream, format(producer, scheme, chunk), function(err) {
        if (err) return fn(err)
        fn(null, chunk)
      })
    } else {
      buffer.push([chunk, fn])
    }
  })
}

/**
 * Format the log to a syslog
 *
 * @param {Producer} producer
 * @param {Object} scheme
 * @param {Buffer} buf
 */

function format (producer, scheme, log) {
  let path = scheme.path && scheme.path !== '/' && scheme.path.replace(/^\//, '')
  let localhost = scheme.auth || log.host || os.hostname()

  return producer.produce({
    appName: path || log.name,
    severity: log.level,
    host: localhost,
    date: log.time,
    message: fmt(log)
  }) + '\r\n'
}
