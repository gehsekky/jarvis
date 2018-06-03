'use strict'

const _            = require('lodash')
const JarvisModule = require('jarvis-module')

class Dongs extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      dongs: function (message, channel, user, args) {
        let response = '8'

        for (let i = 0, randomInt = _.random(32); i < randomInt; i++) {
          response += '='
        }
        response += 'D'

        this.slackClient.sendMessage(response, channel.id)
      },
      butts: function (message, channel, user, args) {
        let response = '',
            random = _.random(100)

        if (random === 100) {
          response = '))<>(('
        } else if (random % 2 === 0) {
          response = '(('
        } else {
          response = '))'
        }

        this.slackClient.sendMessage(response, channel.id)
      }
    })
  }
}

module.exports = Dongs
