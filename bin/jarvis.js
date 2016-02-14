#!/usr/bin/env node
'use strict'

let config    = require('config')
let JarvisBot = require('jarvis-bot')
let log4js    = require('log4js')

// initialize log4js
log4js.configure(config.get('log4js'))

let jarvis
try {
  console.info('Starting Jarvis')
  jarvis = new JarvisBot()
  jarvis.init()
} catch (err) {
  console.error(err)
}

module.exports = jarvis
