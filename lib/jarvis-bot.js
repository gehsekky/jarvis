'use strict'

var config       = require('config')
var JarvisModule = require('jarvis-module')
var Slack        = require('slack-client')

function JarvisBot() {
  this.Commands = null
  this.SlackClient = null
}

JarvisBot.prototype.init = function () {
  // initialize modules
  this.loadModules()

  // initialize slack client
  this.SlackClient = getSlackClient.call(
    this,
    config.get('slack-api-token'),
    config.get('auto-reconnect'),
    config.get('auto-mark')
  )
}

JarvisBot.prototype.loadModules = function () {
  var numModsLoaded = 0
  var modConfigs = config.get('modules')
  var numMods = 0

  // reset commands object
  this.Commands = {}

  // load modules
  for (var modConfig in modConfigs) {
    try {
      JarvisModule.load.call(this, modConfig)
      numModsLoaded++
    } catch ( err ) {
      console.error('error loading module ' + modConfig + ': ' + err)
    } finally {
      numMods++
    }
  }

  console.log('loaded %d/%d modules', numModsLoaded, numMods)
}

function getSlackClient(token, autoReconnect, autoMark) {
  var that = this
  var slack = new Slack(token, autoReconnect, autoMark)

  // bind slack open event
  slack.on('open', function () {

  })

  // bind slack message event
  slack.on('message', function (message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel)
    var user = slack.getUserByID(message.user)
    var commandPrefix = config.get('command-prefix')
    var messageParts, commandRegex, match, command, args

    // check if there is actual text to this message
    if (message.text) {
      // check if message is bot command using regex
      messageParts = message.text.split(' ')
      commandRegex = /^\.([^\s]+)\s*(.*)/
      if (messageParts.length > 0) {
        match = commandRegex.exec(messageParts[0])
        if (match) {
          // extract command and args
          command = match[1]
          messageParts.splice(0, 1)
          args = messageParts.join(' ')

          // if command exists in Commands collection, run it
          if (typeof (that.Commands[command]) === 'function') {
            that.Commands[command](slack, message, channel, user, args)
          }
        }
      }
    }
  })

  slack.login()

  return slack
}

module.exports = JarvisBot
