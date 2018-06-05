#!/usr/bin/env node

const config = require('config')
const JarvisBot = require('jarvis-bot')
const log4js = require('log4js')

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
