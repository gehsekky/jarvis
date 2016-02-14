'use strict'

let _      = require('lodash')
let config = require('config')
let path   = require('path')

/**
 * Manages JarvisBot modules
 */
class JarvisModuleController {
  /**
   * Default constructor
   * @param {JarvisBot} bot - A reference to the current JarvisBot instance
   */
  constructor(bot) {
    /**
     * Keep a local reference to the bot
     * @member {JarvisBot}
     */
    this.bot = bot

    /**
     * The number of mods successfully loaded
     * @member {number}
     */
    this.numModsLoaded = 0

    /**
     * The total number of mods (includes those not loaded as well)
     * @member {number}
     */
    this.numMods = 0
  }

  /**
   * Load modules into bot memory
   */
  loadModules() {
    // reset commands object
    this.bot.commands = {}

    // load modules
    let modNames = config.get('modules')
    for (let modName in modNames) {
      try {
        console.debug(`Loading module [${modName}]`)
        let ModuleDefinition = require(path.join('./module', modName))
        let mod = new ModuleDefinition()

        // run mod initialization
        mod.init(this.bot)

        // load mod commands
        mod.loadCommands(this.bot)

        this.numModsLoaded++
      } catch (err) {
        console.error(`problem loading module [${modName}] => ${err}`)
      } finally {
        this.numMods++
      }
    }

    console.info(`Loaded ${this.numModsLoaded}/${this.numMods} modules`)
  }
}

module.exports = JarvisModuleController
