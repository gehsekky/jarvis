'use strict'

var config = require('config')
var rest = require('rest')
var mime = require('rest/interceptor/mime')
var pathPrefix = require('rest/interceptor/pathPrefix')

// set up wunderground rest api client
var wunderground = rest
.wrap(mime)
.wrap(pathPrefix, {
  prefix: 'http://api.wunderground.com/api/' + config.get('modules.wunderground.api-key') + '/geolookup/q'
})

function Wunderground() {
  this.Commands = {
    wunderground: function (slack, message, channel, user, args) {
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
      .catch(function (err) {
        console.error('error: ', err)
      })
    }
  }
}

module.exports = Wunderground
