const rest = require('rest')
const mime = require('rest/interceptor/mime')
const pathPrefix = require('rest/interceptor/pathPrefix')
const JarvisModule = require('jarvis-module')

const client = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'https://www.google.com/?q='
})

class Google extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      google(message, channel, user, args) {
        return client({
          path: encodeURIComponent(args),
          method: 'get'
        })
        .then(response => console.log('response', response))
        .catch(console.error)
      }
    })
  }
}

module.exports = Google
