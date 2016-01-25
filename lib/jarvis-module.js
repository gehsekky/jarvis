'use strict'

var _ = require('lodash')
var path = require('path')

var JarvisModule = {
  load: function (moduleName) {
    // initialize mod
    var ModuleDefinition = require(path.join('./module', moduleName))
    var mod = new ModuleDefinition()
    if (typeof (mod.init) === 'function') {
      mod.init(this)
    }

    // absorb mod commands
    if ( mod.Commands ) {
      this.Commands = _.assign({}, this.Commands, mod.Commands)
    }
  }
}

module.exports = JarvisModule
