'use strict'

let _            = require('lodash')
let JarvisModule = require('jarvis-module')

class Dongs extends JarvisModule {
  loadCommands(bot) {
    bot.commands.dongs = function (rtm, message, channel, user, args) {
      let response = '8'

      for (let i = 0, randomInt = _.random(32); i < randomInt; i++) {
        response += '='
      }
      response += 'D'

      rtm.sendMessage(response, channel.id)
    }

    bot.commands.butts = function (rtm, message, channel, user, args) {
      let response = '',
          random = _.random(100)

      if (random === 100) {
        response = '))<>(('
      } else if (random % 2 === 0) {
        response = '(('
      } else {
        response = '))'
      }

      rtm.sendMessage(response, channel.id)
    }
  }
}

module.exports = Dongs
