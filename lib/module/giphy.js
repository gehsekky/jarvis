'use strict'

var _ = require('lodash')
var config = require('config')
var rest = require('rest')
var mime = require('rest/interceptor/mime')
var pathPrefix = require('rest/interceptor/pathPrefix')

var giphy = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.giphy.com/v1/gifs'
})

function Giphy() {
  this.Commands = {
    giphy: function (slack, message, channel, user, args) {
      if (args) {
        giphy({
          path: [
            '/random' +
            '?tag=' + encodeURIComponent(args),
            '&api_key=' + config.get('modules.giphy.api-key'),
            (config.get('modules.giphy.rating') ? '&rating=' + config.get('modules.giphy.rating') : '')
          ].join(''),
          method: 'get'
        })
        .then(function (result) {
          var random, attachments = []

          if (result && result.entity && result.entity.data) {
            // build attachment
            var attachment = {
              color: config.get('modules.giphy.attachment-color'),
              fallback: result.entity.data.url,
              title: args,
              title_link: result.entity.data.url,
              image_url: result.entity.data.image_url
            }

            attachments.push(attachment)

            channel.postMessage({
              attachments: attachments
            })
          } else {
            channel.send('No results found')
          }
        })
        .catch(function (err) {
          console.error('error occurred while querying giphy api', err)
        })
      } else {
        channel.send('No search terms detected')
      }
    }
  }
}

Giphy.prototype.init = function () {

}

module.exports = Giphy
