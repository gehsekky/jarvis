const moment = require('moment')
const JarvisModule = require('jarvis-module')

class Uptime extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      uptime(message, channel) {
        const now = moment()
        const numSeconds = now.diff(bot.startedAt, 'seconds') - (now.diff(bot.startedAt, 'minutes') * 60)
        const numMinutes = now.diff(bot.startedAt, 'minutes') - (now.diff(bot.startedAt, 'hours') * 60)
        const numHours = now.diff(bot.startedAt, 'hours') - (now.diff(bot.startedAt, 'days') * 24)
        const numDays = now.diff(bot.startedAt, 'days')

        let numNonZeros = 0
        const displayTime = [
          (numDays ? `${numDays} days` : ''),
          (numHours ? `${numHours} hours` : ''),
          (numMinutes ? `${numMinutes} minutes` : ''),
          (numSeconds ? `${numSeconds} seconds` : '')
        ].reduce((prev, curr, index, array) => {
          if (curr) {
            numNonZeros += 1
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

        this.slackClient.sendMessage(`I have been up for ${displayTime}`, channel.id)
      }
    })
  }
}

module.exports = Uptime
