const config = require('config')
const rest = require('rest')
const mime = require('rest/interceptor/mime')
const pathPrefix = require('rest/interceptor/pathPrefix')
const JarvisModule = require('jarvis-module')

const client = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.giphy.com/v1/gifs'
})

class Giphy extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      giphy(message, channel, user, args) {
        if (!args) {
          this.slackClient.sendMessage('No search terms detected', channel.id)
          return null
        }

        return client({
          path: `/random?tag=${encodeURIComponent(args)}&api_key=${config.get('modules.giphy.api-key')}`,
          method: 'get'
        })
        .then((result) => {
          const attachments = []

          if (!result || !result.entity || !result.entity.data) {
            this.slackClient.sendMessage('No results found', channel.id)
            return null
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
