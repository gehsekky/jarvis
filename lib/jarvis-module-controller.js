const config = require('config')
const path = require('path')

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

    // reset mod meta data
    this.numModsLoaded = 0
    this.numMods = 0

    // load modules
    const modNames = config.get('modules')
    for (const modName in modNames) {
      if (Object.prototype.hasOwnProperty.call(modNames, modName)) {
        try {
          console.log(`Loading module [${modName}]`)

          const ModuleDefinition = require(path.join('./module', modName))
          const mod = new ModuleDefinition()

          // run mod initialization
          mod.init(this.bot)

          // load mod commands
          mod.loadCommands(this.bot)

          this.numModsLoaded += 1
        } catch (err) {
          console.error(`problem loading module [${modName}] => ${err}`)
        } finally {
          this.numMods += 1
        }
      }
    }

    console.info(`Loaded ${this.numModsLoaded}/${this.numMods} modules`)
  }
}

module.exports = JarvisModuleController
