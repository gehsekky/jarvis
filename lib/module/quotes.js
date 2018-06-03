'use strict'

const JarvisModule = require('jarvis-module')

class Quotes extends JarvisModule {
  loadCommands(bot) {
    bot.commands.newFunction = function (message, channel, user, args) {

    }
  }
}

module.exports = Quotes
