'use strict'

/**
 * Module Dependencies
 */

let Again = require('try-again')
let net = require('net')
let tls = require('tls')
let again = Again()

module.exports = function (port, host, ready) {
  return again(function (success, failure) {
    let socket = net.connect(port, host, on_socket_connect)
    let stream = null

    socket.setKeepAlive(true, 15000)
    socket.once('error', failure)
    socket.once('close', failure)
    socket.once('end', failure)

    function on_socket_connect () {
      stream = tls.connect({
        socket: socket,
        rejectUnauthorized: false
      }, function () {
        success(stream)
      })

      stream.once('close', failure)
      stream.once('error', failure)
      stream.once('end', failure)
    }
  }, status)

  function status (err, stream) {
    return err ? ready(null) : ready(stream)
  }
}
