'use strict'

let moment       = require('moment')
let JarvisModule = require('jarvis-module')

class Jarvis extends JarvisModule {
  loadCommands(bot) {
    bot.commands.uptime = function (slack, message, channel, user, args) {
      let now = moment()
      let numSeconds = now.diff(bot.startedAt, 'seconds') - now.diff(bot.startedAt, 'minutes') * 60
      let numMinutes = now.diff(bot.startedAt, 'minutes') - now.diff(bot.startedAt, 'hours') * 60
      let numHours = now.diff(bot.startedAt, 'hours') - now.diff(bot.startedAt, 'days') * 24
      let numDays = now.diff(bot.startedAt, 'days')

      let numNonZeros = 0
      let displayTime = [
        (numDays ? `${numDays} days` : ''),
        (numHours ? `${numHours} hours` : ''),
        (numMinutes ? `${numMinutes} minutes` : ''),
        (numSeconds ? `${numSeconds} seconds` : '')
      ].reduce((prev, curr, index, array) => {
        if (curr) {
          numNonZeros++
        }

        return (
          curr ? (
            prev ? (
              index === array.length - 1 ? (
                numNonZeros > 2 ? `${prev}, and ${curr}` : `${prev} and ${curr}`
              ) : `${prev}, ${curr}`
            ) : curr
          ) : prev
        )
      }, '')

      channel.send(`I have been up for ${displayTime}`)
    }
  }
}

module.exports = Jarvis
