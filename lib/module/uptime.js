'use strict'

let moment       = require('moment')
let JarvisModule = require('jarvis-module')

class Uptime extends JarvisModule {
  loadCommands(bot) {
    bot.commands.uptime = function (slack, message, channel, user, args) {
      let now = moment()
      let numDays = now.diff(bot.startedAt, 'days')
      let numHours = now.diff(bot.startedAt, 'hours')
      let numMinutes = now.diff(bot.startedAt, 'minutes')
      let numSeconds = now.diff(bot.startedAt, 'seconds')
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

module.exports = Uptime
