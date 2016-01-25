'use strict'

module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    mochacli: {
      options: {

      },
      all: ['test/**/*.js']
    },
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*.js'
        }
      },
      istanbul_check_coverage: {
        default: {
          options: {
            coverageFolder: 'coverage*',
            check: {
              lines: 80,
              statements: 80
            }
          }
        }
      }
    },
    jsdoc: {
      dist: {
        src: ['lib/**/*.js', 'test/**/*.js', 'README.md'],
        options: {
          destination: 'doc'
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*'],
        tasks: ['jshint', 'test'],
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'test/**/*.js', 'bin/**/*.js', 'lib/**/*.js'],
      options: {
        asi: true,
        devel: true,
        node: true,
        mocha: true,
        loopfunc: true,
        globals: {
          Promise: true
        }
      }
    }
  })

  grunt.event.on('coverage', function(lcovFileContents, done){
      // Check below on the section "The coverage event"
      done()
  })

  grunt.loadNpmTasks('grunt-jsdoc')
  grunt.loadNpmTasks('grunt-mocha-istanbul')
  grunt.loadNpmTasks('grunt-mocha-cli')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-jshint')

  grunt.registerTask('test', ['mochacli'])
  grunt.registerTask('default', ['test'])
  grunt.registerTask('coverage', ['mocha_istanbul:coverage'])

}