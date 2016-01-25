'use strict'

function Dongs() {
  this.Commands = {
    dongs: function (slack, message, channel, user, args) {
      var randomInt = Math.floor(Math.random() * 31 + 1)
      var response = '8'
      for (var i = 0; i < randomInt; i++) {
        response += '='
      }
      response += 'D'

      channel.send(response)
    }
  }
}

Dongs.prototype.init = function () {

}

module.exports = Dongs
