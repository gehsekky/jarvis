'use strict'

var chai = require('chai')
var assert = chai.assert
var expect = chai.expect

describe('JarvisModule test suite', function () {
  var JarvisModule
  describe('startup tests', function () {
    it('should not fail to be required', function () {
      JarvisModule = require('jarvis-module')
    })
  })

  describe('load tests', function () {
    it('should throw an error with no moduleName passed in', function () {
      assert.throws(function () {
        JarvisModule.load()
      }, 'moduleName missing')
    })

    it('should throw an error with empty string passed in', function () {
      assert.throws(function () {
        JarvisModule.load('')
      }, 'moduleName missing')
    })

    it('should load the wunderground module with no exception', function () {
      var testThis = { Commands: {}}
      JarvisModule.load.call(testThis, 'wunderground')
      expect(testThis.Commands).to.have.property('wunderground')
    })
  })
})
