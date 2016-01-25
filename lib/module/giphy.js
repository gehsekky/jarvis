'use strict'

var config = require('config')
var rest = require('rest')
var mime = require('rest/interceptor/mime')
var pathPrefix = require('rest/interceptor/pathPrefix')

var client = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.giphy.com/v1/gifs'
})

function Giphy() {
  this.Commands = {
    giphy: function (slack, message, channel, user, args) {
      if (args) {
        client({
          path: '/search?q=' + encodeURIComponent(args) + '&api_key=' + config.get('modules.giphy.api-key') + '&limit=1&rating=pg-13'
        })
        .then(function (result) {
          if (result && result.entity && result.entity.data) {
            channel.send(result.entity.data[0].url)
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
