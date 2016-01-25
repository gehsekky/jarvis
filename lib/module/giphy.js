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
            '/search' +
            '?q=' + encodeURIComponent(args),
            '&api_key=' + config.get('modules.giphy.api-key'),
            (config.get('modules.giphy.rating') ? '&rating=' + config.get('modules.giphy.rating') : '')
          ].join(''),
          method: 'get'
        })
        .then(function (result) {
          var random
          if (result && result.entity && result.entity.data && result.entity.data.length > 0) {
            random = _.random(result.entity.data.length - 1)
            channel.send(result.entity.data[random].url)
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
