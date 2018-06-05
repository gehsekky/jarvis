const JarvisBot = require('jarvis-bot')

describe('JarvisBot test suite', () => {
  describe('constructor tests', () => {
    it('should instantiate and set properties to null', () => {
      const bot = new JarvisBot()
      expect(bot.commands).toBe(null)
      expect(bot.slackClient).toBe(null)
    })
  })

  describe('member function tests', () => {
    it('should init and not throw error', () => {
      const bot = new JarvisBot()
      expect(() => {
        bot.init()
      }).not.toThrow()
    })
  })
})
