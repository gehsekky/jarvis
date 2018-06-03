'use strict'

const _             = require('lodash')
const config        = require('config')
const rest          = require('rest')
const mime          = require('rest/interceptor/mime')
const pathPrefix    = require('rest/interceptor/pathPrefix')
const JarvisModule  = require('jarvis-module')

let giphy = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.giphy.com/v1/gifs'
})

class Giphy extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      giphy: function (message, channel, user, args) {
        if (!args) {
          this.slackClient.sendMessage('No search terms detected', channel.id)
          return
        }

        return giphy({
          path: `/random?tag=${encodeURIComponent(args)}&api_key=${config.get('modules.giphy.api-key')}`,
          method: 'get'
        })
        .then(result => {
          let attachments = []

          if (!result || !result.entity || !result.entity.data) {
            this.slackClient.sendMessage('No results found', channel.id)
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

          return this.web.chat.postMessage({
            channel: channel.id,
            attachments,
            as_user: true
          })
        })
        .catch(console.error)
      }
    })
  }
}

module.exports = Giphy
