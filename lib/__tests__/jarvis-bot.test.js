'use strict'

const JarvisBot = require('jarvis-bot');

describe('JarvisBot test suite', function () {
  describe('constructor tests', function () {
    it('should instantiate and set properties to null', function () {
      const bot = new JarvisBot()
      expect(bot.commands).toBe(null);
      expect(bot.slackClient).toBe(null);
    });
  });

  describe('member function tests', function () {
    it('should init and not throw error', function () {
      const bot = new JarvisBot()
      expect(() => {
        bot.init();
      }).not.toThrow();
    })
  })
})
