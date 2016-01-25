#!/usr/bin/env node

'use strict'

var JarvisBot = require('jarvis-bot')

var jarvis

console.log('starting jarvis')

try {
  jarvis = new JarvisBot()
  jarvis.init()
} catch (e) {
  console.log('error', e)
}

module.exports = jarvis
