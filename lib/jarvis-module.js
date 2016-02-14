'use strict'

/**
 * A virtual class template for JarvisBot modules
 */
class JarvisModule {
  /**
   * Virtual constructor
   */
  constructor() {

  }

  /**
   * Virtual initialization function
   * @param {JarvisBot} bot - A reference to the current JarvisBot instance
   */
  init(bot) {

  }

  /**
   * Virtual function for loading commands
   * @param {JarvisBot} bot - A reference to the current JarvisBot instance
   */
  loadCommands(bot) {

  }
}

module.exports = JarvisModule
