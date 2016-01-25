'use strict'

var JarvisModule = require('jarvis-module')
var util = require('util')

function Dongs() {
  this.commands = {
    'dongs': function (slack, message) {

    }
  }
}

util.inherits(Dongs, JarvisModule)

module.exports = Dongs
