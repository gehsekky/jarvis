const JarvisModule = require('jarvis-module')

class Quotes extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      newFunction(message, channel, user, args) { //  eslint-disable-line no-unused-vars

      }
    })
  }
}

module.exports = Quotes
