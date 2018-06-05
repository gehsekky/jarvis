const config = require('config')
const rest = require('rest')
const mime = require('rest/interceptor/mime')
const pathPrefix = require('rest/interceptor/pathPrefix')
const JarvisModule = require('jarvis-module')

// set up wunderground rest api client
const wunderground = rest
  .wrap(mime)
  .wrap(pathPrefix, {
    prefix: `http://api.wunderground.com/api/${config.get('modules.wunderground.api-key')}/geolookup/q`
  })

class Wunderground extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      wunderground(message, channel, user, args) {
        // make wunderground api zipcode query
        return wunderground({
          path: `/${args}.json`,
          method: 'get'
        })
        .then((response) => {
          // if response contains url, send it to channel
          if (response.entity && response.entity.location && response.entity.location.wuiurl) {
            this.slackClient.sendMessage(response.entity.location.wuiurl, channel.id)
          } else {
            this.slackClient.sendMessage('No results found', channel.id)
          }
        })
        .catch(console.error)
      }
    })
  }
}

module.exports = Wunderground
