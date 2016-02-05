'use strict'

var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
var JarvisBot = require('jarvis-bot')

describe('JarvisBot test suite', function () {
  describe('constructor tests', function () {
    it('should instantiate and set properties to null', function () {
      var bot = new JarvisBot()
      expect(bot.Commands).to.be.null
      expect(bot.SlackClient).to.be.null
    })
  })

  describe('member function tests', function () {
    it('should init and not throw error', function () {
      var bot = new JarvisBot()
      assert.doesNotThrow(function () {
        bot.init()
      })
    })
  })
})
