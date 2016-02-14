'use strict'

let _            = require('lodash')
let config       = require('config')
let rest         = require('rest')
let mime         = require('rest/interceptor/mime')
let pathPrefix   = require('rest/interceptor/pathPrefix')
let JarvisModule = require('jarvis-module')

let giphy = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.giphy.com/v1/gifs'
})

class Giphy extends JarvisModule {
  loadCommands(bot) {
    bot.commands.giphy = function (slack, message, channel, user, args) {
      if (!args) {
        channel.send('No search terms detected')
        return
      }

      giphy({
        path: `/random?tag=${encodeURIComponent(args)}&api_key=${config.get('modules.giphy.api-key')}`,
        method: 'get'
      })
      .then(result => {
        let attachments = []

        if (!result || !result.entity || !result.entity.data) {
          channel.send('No results found')
          return
        }

        // build attachment
        attachments.push({
          color: config.get('modules.giphy.attachment-color'),
          fallback: result.entity.data.url,
          title: args,
          title_link: result.entity.data.url,
          image_url: result.entity.data.image_url
        })

        channel.postMessage({
          attachments: attachments
        })
      })
      .catch(console.error)
    }
  }
}

module.exports = Giphy
