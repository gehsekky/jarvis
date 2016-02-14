/* jshint expr: true */
'use strict'

let chai = require('chai')
let assert = chai.assert
let expect = chai.expect
let JarvisBot = require('jarvis-bot')

describe('JarvisBot test suite', function () {
  describe('constructor tests', function () {
    it('should instantiate and set properties to null', function () {
      let bot = new JarvisBot()
      expect(bot.commands).to.be.null
      expect(bot.slackClient).to.be.null
    })
  })

  describe('member function tests', function () {
    it('should init and not throw error', function () {
      let bot = new JarvisBot()
      assert.doesNotThrow(function () {
        bot.init()
      })
    })
  })
})
