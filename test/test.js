'use strict'

/**
 * Module Dependencies
 */

let log = require('loo')('papertrail')
let Papertrail = require('..')

/**
 * Environment
 */

let env = require('envobj')({
  PAPERTRAIL_URL: String
})

/**
 * Papertrail
 */

let papertrail = Papertrail(env.PAPERTRAIL_URL)
log.info.pipe(papertrail)
log.error.pipe(papertrail)

log.info('hi bro', {
  user: 1,
  team: 'a'
})



setInterval(function() {
  log('another').error(new Error('c'))
}, 1000)
