'use strict'

let config                 = require('config')
let moment                 = require('moment')
let JarvisModuleController = require('jarvis-module-controller')
let Slack                  = require('slack-client')

/**
 * nodeJS slack bot
 */
class JarvisBot {
  /**
   * Default constructor
   */
  constructor() {
    this.commands = null
    this.slackClient = null
    this.startedAt = moment()
  }

  /**
   * Initialize bot
   */
  init() {
    // initialize modules
    let moduleController = new JarvisModuleController(this)
    moduleController.loadModules()

    // initialize slack client
    this.loadSlack(
      config.get('slack-api-token'),
      config.get('auto-reconnect'),
      config.get('auto-mark')
    )
  }

  /**
   * Load Slack client
   * @param {string} token - The Slack API token
   * @param {boolean} autoReconnect - Flag for whether to automatically reconnect
   * @param {boolean} autoMark - Flag for auto marking messages as read
   */
  loadSlack(token, autoReconnect, autoMark) {
    let slack = null,
        bot = null

    // reset slack client
    this.slackClient = null

    slack = new Slack(token, autoReconnect, autoMark)

    // bind slack loggedIn event
    slack.on('loggedIn', (user, team) => {
      bot = user
      console.info(`Logged into Slack as ${user.name}`)
    })

    // bind slack open event
    slack.on('open', () => console.debug('Slack connection opened'))

    // bind slack message event
    slack.on('message', (message) => {
      let channel = slack.getChannelGroupOrDMByID(message.channel),
          user = slack.getUserByID(message.user),
          commandPrefix = config.get('command-prefix'),
          messageParts, commandRegex, match, command, args

      // ignore messages from bot itself
      if (message.user === bot.id) return

      // check if there is actual text to this message
      if (!message.text) return

      // check if message is bot command using regex
      messageParts = message.text.split(' ')
      if (!messageParts.length) return
      commandRegex = /^\.([^\s]+)\s*(.*)/
      match = commandRegex.exec(messageParts[0])
      if (!match) return

      // extract command and args
      command = match[1]
      messageParts.splice(0, 1)
      args = messageParts.join(' ')

      // if command exists in commands collection, run it
      if (typeof (this.commands[command]) === 'function') {
        console.debug(`Running command [${command}] by user [${user.name}]`)
        this.commands[command](slack, message, channel, user, args)
      }

      // TODO if not command, see if trigger conditions are met
    })

    // bind on slack error event
    slack.on('error', console.error)

    // login to slack
    slack.login()

    this.slackClient = slack
  }
}

module.exports = JarvisBot
