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
  this.loadSlack(
    config.get('slack-api-token'),
    config.get('auto-reconnect'),
    config.get('auto-mark')
  )
}

JarvisBot.prototype.loadModules = function () {
  var numModsLoaded = 0,
      numMods = 0,
      modConfigs = config.get('modules')

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

JarvisBot.prototype.loadSlack = function (token, autoReconnect, autoMark) {
  var that = this,
      slack, bot

  // reset slack client
  this.SlackClient = null

  slack = new Slack(token, autoReconnect, autoMark)

  // bind slack open event
  slack.on('open', function () {
    console.info('slack connection opened')
  })

  slack.on('loggedIn', function (user, team) {
    bot = user
    console.info('logged into slack')
  })

  // bind slack message event
  slack.on('message', function (message) {
    var channel = slack.getChannelGroupOrDMByID(message.channel),
        user = slack.getUserByID(message.user),
        commandPrefix = config.get('command-prefix'),
        messageParts, commandRegex, match, command, args

    // ignore messages from bot itself
    if (message.user === bot.id) return

    // check if there is actual text to this message
    if (!message.text) return

    // check if message is bot command using regex
    messageParts = message.text.split(' ')
    if (messageParts.length === 0) return
    commandRegex = /^\.([^\s]+)\s*(.*)/
    match = commandRegex.exec(messageParts[0])
    if (!match) return

    // extract command and args
    command = match[1]
    messageParts.splice(0, 1)
    args = messageParts.join(' ')

    // if command exists in Commands collection, run it
    if (typeof (that.Commands[command]) === 'function') {
      that.Commands[command](slack, message, channel, user, args)
    }
  })

  slack.on('error', function (err) {
    console.error('error: ', err)
  })

  // login to slack
  slack.login()

  this.SlackClient = slack
}

module.exports = JarvisBot
