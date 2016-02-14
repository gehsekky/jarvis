'use strict'

let chai = require('chai')
let assert = chai.assert
let expect = chai.expect
let JarvisModule = require('jarvis-module')

describe('JarvisModule test suite', function () {
  describe('constructor tests', function () {
    it('should instantiate virtual module without errors', function () {
      assert.doesNotThrow(function () {
        let mod = new JarvisModule()
      })
    })
  })

  describe('init tests', function () {
    it('should init fine', function () {
      let mod = new JarvisModule()
      assert.doesNotThrow(function () {
        mod.init()
      })
    })
  })
})
