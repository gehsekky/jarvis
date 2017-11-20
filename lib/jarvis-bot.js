'use strict'

const config = require('config')
const moment = require('moment')
const JarvisModuleController = require('jarvis-module-controller')
const RtmClient = require('@slack/client').RtmClient
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS
const RTM_EVENTS = require('@slack/client').RTM_EVENTS
const MemoryDataStore = require('@slack/client').MemoryDataStore

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
    this.moduleController = null
  }

  /**
   * Initialize bot
   */
  init() {
    // initialize modules
    this.moduleController = new JarvisModuleController(this)
    this.moduleController.loadModules()

    // initialize slack client
    this.loadSlack(
      config.get('slack-api-token'),
      config.get('auto-reconnect')
    )
  }

  /**
   * Load Slack client
   * @param {string} token - The Slack API token
   * @param {boolean} autoReconnect - Flag for whether to automatically reconnect
   */
  loadSlack(token, autoReconnect) {
    let rtm = null,
        bot = null

    // reset slack client
    this.slackClient = null

    rtm = new RtmClient(token, {
      autoReconnect,
      dataStore: new MemoryDataStore()
    })

    rtm.start()

    // bind slack loggedIn event
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
      bot = rtmStartData.self
      console.info(`Logged into Slack as ${bot.name}`)
    })

    // bind slack open event
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => console.debug('Slack connection opened'))

    // bind slack message event
    rtm.on(RTM_EVENTS.MESSAGE, message => {
      console.log('rtmStartData', message)
      let channel = rtm.dataStore.getChannelById(message.channel),
          user = rtm.dataStore.getUserById(message.user),
          commandPrefix = config.get('command-prefix'),
          messageParts, commandRegex, match, command, args

      console.log('rtm.dataStore.channels', rtm.dataStore.channels)

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
        console.log(`Running command [${command}] by user [${user.name}]`)
        this.commands[command](rtm, message, channel, user, args)
      }

      // TODO if not command, see if trigger conditions are met
    })

    // bind on slack error event
    rtm.on('error', console.error)

    // login to slack
    // rtm.login()

    this.slackClient = rtm
  }
}

module.exports = JarvisBot
