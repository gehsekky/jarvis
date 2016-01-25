'use strict'

var _ = require('lodash')

function Dongs() {
  this.Commands = {
    dongs: function (slack, message, channel, user, args) {
      var response = '8',
          randomInt = _.random(32)

      for (var i = 0; i < randomInt; i++) {
        response += '='
      }
      response += 'D'

      channel.send(response)
    },
    butts: function (slack, message, channel, user, args) {
      var response = '',
          random = _.random(100)

      if (random === 100) {
        response = '))<>(('
      } else if (random % 2 === 0) {
        response = '(('
      } else {
        response = '))'
      }

      channel.send(response)
    }
  }
}

Dongs.prototype.init = function () {

}

module.exports = Dongs
