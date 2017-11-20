'use strict'

const JarvisModule = require('jarvis-module');

describe('JarvisModule test suite', function () {
  describe('constructor tests', function () {
    it('should instantiate virtual module without errors', function () {
      expect(() => {
        const mod = new JarvisModule();
      }).not.toThrow();
    });
  });

  describe('init tests', function () {
    it('should init fine', function () {
      const mod = new JarvisModule()
      expect(() => {
        mod.init();
      }).not.toThrow();
    });
  });
});
