const config = require('config')
const moment = require('moment')
const JarvisModuleController = require('jarvis-module-controller')
const { RTMClient, WebClient } = require('@slack/client')

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
    this.web = null
  }

  /**
   * Initialize bot
   */
  init() {
    // initialize modules
    this.moduleController = new JarvisModuleController(this)
    this.moduleController.loadModules()

    this.web = new WebClient(config.get('slack-api-token'))

    // initialize slack client
    this.loadSlack(
      config.get('slack-api-token'),
      config.get('auto-reconnect')
    )
  }

  /**
   * Load Slack client
   * @param {string} token - The Slack API token
   * @param {boolean} useRtmConnect - Flag for whether to automatically reconnect
   */
  loadSlack(token, useRtmConnect) {
    let rtm = null
    let bot = null

    // reset slack client
    this.slackClient = null

    rtm = new RTMClient(token, {
      useRtmConnect
    })

    rtm.start()

    // bind slack loggedIn event
    rtm.on('authenticated', (rtmStartData) => {
      bot = rtmStartData.self
      console.info(`Logged into Slack as ${bot.name}`)
    })

    // bind slack open event
    rtm.on('connected', () => console.debug('successfully connected to Slack'))

    // bind slack message event
    rtm.on('message', (message) => {
      const commandPrefix = config.get('command-prefix')
      let messageParts = null
      let commandRegex = null
      let match = null
      let command = null
      let args = null
      let channel = null
      let user = null

      return this.web.users.info({ user: message.user })
      .then((response) => {
        user = response.user
        return this.web.conversations.info({ channel: message.channel })
      })
      .then((response) => {
        channel = response.channel

        // ignore messages from bot itself
        if (message.user === bot.id) return

        // check if there is actual text to this message
        if (!message.text) return

        // check if message is bot command using regex
        messageParts = message.text.split(' ')
        if (!messageParts.length) return
        commandRegex = new RegExp('^\\' + commandPrefix + '([^\\s]+)\\s*(.*)', 'i') // eslint-disable-line prefer-template
        match = commandRegex.exec(messageParts[0])
        if (!match) return

        // extract command and args
        command = match[1]
        messageParts.splice(0, 1)
        args = messageParts.join(' ')

        // if command exists in commands collection, run it
        if (typeof (this.commands[command]) === 'function') {
          console.log(`Running command [${command}] by user [${user.name}]`)
          this.commands[command].call(this, message, channel, user, args)
        }

        // TODO if not command, see if trigger conditions are met
      })
      .catch(console.error)
    })

    // bind on slack error event
    rtm.on('error', console.error)

    // login to slack
    // rtm.login()

    this.slackClient = rtm
  }
}

module.exports = JarvisBot
