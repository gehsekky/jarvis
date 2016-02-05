'use strict'

var chai = require('chai')
var assert = chai.assert
var expect = chai.expect
var JarvisModule = require('jarvis-module')

describe('dongs module test suite', function () {
  var testThis = { Commands: {}}
  describe('load tests', function () {
    it('should load the dongs module with no exceptions', function () {
      JarvisModule.load.call(testThis, 'dongs')
      expect(testThis.Commands).to.have.property('dongs')
    })
  })

  describe('command tests', function () {
    it('should run dongs with no exceptions', function () {
      assert.doesNotThrow(function () {
        testThis.Commands.dongs(null, null, { send: function () {}}, null, null)
      })
    })

    it('should run butts with no exceptions', function () {
      assert.doesNotThrow(function () {
        testThis.Commands.butts(null, null, { send: function () {}}, null, null)
      })
    })
  })
})
