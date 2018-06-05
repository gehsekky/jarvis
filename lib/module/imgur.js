const _ = require('lodash')
const config = require('config')
const rest = require('rest')
const defaultRequest = require('rest/interceptor/defaultRequest')
const mime = require('rest/interceptor/mime')
const pathPrefix = require('rest/interceptor/pathPrefix')
const JarvisModule = require('jarvis-module')

const client = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'https://api.imgur.com/3'
})
.wrap(defaultRequest, {
  method: 'get',
  headers: {
    'Authorization': `Client-ID ${config.get('modules.imgur.clientId')}`
  }
})

class Imgur extends JarvisModule {
  loadCommands(bot) {
    bot.commands = Object.assign(bot.commands, {
      imgur(message, channel, user, args) {
        if (!args) {
          this.slackClient.sendMessage('No search terms detected', channel.id)
          return null
        }

        return client({
          path: `/gallery/search/?q=${encodeURIComponent(args)}`
        })
        .then((response) => {
          const attachments = []

          if (!response || !response.entity || !response.entity.data) {
            this.slackClient.sendMessage('No results found', channel.id)
            return null
          }

          const searchItem = response.entity.data[_.random(response.entity.data.length - 1)]

          console.log('searchItem', searchItem)

          const image = searchItem.images ? searchItem.images[_.random(searchItem.images.length - 1)] : searchItem

          console.log('image', image)

          // build attachment
          attachments.push({
            color: config.get('modules.imgur.attachment-color'),
            fallback: searchItem.link,
            title: args,
            title_link: searchItem.link,
            image_url: image.link
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

module.exports = Imgur
