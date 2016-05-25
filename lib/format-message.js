'use strict'

/**
 * Module Dependencies
 */

let stringify = require('json-stringify-safe')
let indent = require('indent-string')
let chalk = require('chalk')

/**
 * Export `format_message`
 */

module.exports = format_message

/**
 * Format message
 *
 * @param {Object} log
 * @return {String}
 */

function format_message (log) {
  let message = []

  // level + message
  message.push(colors(pad(log.level, 5)) + ' ' + log.message)

  // error
  if (log.err) {
    message.push(indent(log.err.stack, ' ', 4))
  }

  // fields
  if (log.fields) {
    message.push(indent(stringify(log.fields, null, 2), ' ', 4))
  }

  return message.join('\n')
}

/**
 * Colors
 */

function colors (level) {
  switch (level.trim()) {
    case 'fatal': return chalk.red(level)
    case 'error': return chalk.red(level)
    case 'warn': return chalk.yellow(level)
    case 'info': return chalk.blue(level)
    case 'debug': return chalk.cyan(level)
    case 'trace': return chalk.gray(level)
  }
}

function pad(str, n) {
  str = String(str)
  while (str.length < n) {
    str = ' ' + str
  }
  return str
}
