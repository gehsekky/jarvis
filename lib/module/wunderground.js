'use strict'

let config       = require('config')
let rest         = require('rest')
let mime         = require('rest/interceptor/mime')
let pathPrefix   = require('rest/interceptor/pathPrefix')
let JarvisModule = require('jarvis-module')

// set up wunderground rest api client
let wunderground = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: `http://api.wunderground.com/api/${config.get('modules.wunderground.api-key')}/geolookup/q`
})

class Wunderground extends JarvisModule {
  loadCommands(bot) {
    bot.commands.wunderground = function (slack, message, channel, user, args) {
      // make wunderground api zipcode query
      wunderground({
        path: '/{zipCode}.json',
        params: {
          zipCode: args
        },
        method: 'get'
      })
      .then(function (response) {
        // if response contains url, send it to channel
        if (response.entity && response.entity.location && response.entity.location.wuiurl) {
          channel.send(response.entity.location.wuiurl)
        } else {
          channel.send('No results found')
        }
      })
      .catch(console.error)
    }
  }
}

module.exports = Wunderground
