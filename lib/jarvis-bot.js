'use strict'

var config = require('config')
var JarvisSlackClient = require('jarvis-slack-client')

function JarvisBot() {
  this.SlackClient = null
}

JarvisBot.prototype.init = function () {
  // initialize modules

  // initialize slack client
  this.SlackClient = getSlackClient(
    config.get('slack-api-token'),
    config.get('auto-reconnect'),
    config.get('auto-mark')
  )
}

JarvisBot.prototype.loadModules = function () {
  
}

function getSlackClient(token, autoReconnect, autoMark) {
  var slack = new Slack(token, autoReconnect, autoMark)

  slack.on('open', function () {
    console.log('opening connection to slack')
  })

  slack.on('message', function (message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel)
    var channelName = ''
    var user = slack.getUserByID(message.user)
    var userName = ''
    var response = ''

    if (channel) {
      if (channel.is_channel) {
        channelName += '#'
      }
      channelName += channel.name
    } else {
      channelName += 'UNKNOWN_CHANNEL'
    }

    if (user) {
      if (user.name) {
        userName = '@#' + user.name
      }
    } else {
      userName = 'UNKNOWN_USER'
    }

    console.log('user {' + userName + '} in channel {' + channelName + '} said {' + message.text + '}')

    if (message.text === 'dongs') {
      response = '8========D'
      channel.send(response)
    }
  })

  slack.login()

  return slack
}

module.exports = JarvisBot
