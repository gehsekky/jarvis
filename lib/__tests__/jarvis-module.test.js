const JarvisModule = require('jarvis-module')

describe('JarvisModule test suite', () => {
  describe('constructor tests', () => {
    it('should instantiate virtual module without errors', () => {
      expect(() => {
        const mod = new JarvisModule()
        expect(mod).toBeTruthy()
      }).not.toThrow();
    });
  });

  describe('init tests', () => {
    it('should init fine', () => {
      const mod = new JarvisModule()
      expect(() => {
        mod.init()
      }).not.toThrow()
    });
  });
});
