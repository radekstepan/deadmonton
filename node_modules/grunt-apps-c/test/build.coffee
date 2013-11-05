#!/usr/bin/env coffee
proxy  = do require('proxyquire').noCallThru
assert = require 'assert'
async  = require 'async'
fs     = require 'fs'
_      = require 'lodash'

# Track errors here.
errors = []

# Abuse these deps.
deps =
    './grunt/fail':
        'code':
            'TASK_FAILURE': null
        'report': ->
        'fatal': ->
        'warn': (err) -> errors.push err

# Proxy require grunt.
grunt = proxy 'grunt', deps

# Do not use a Gruntfile.
grunt.task.init = ->

# Load our builder.
grunt.loadTasks('tasks')

# Silence output.
grunt.loadNpmTasks('grunt-verbosity')

# Here we are.
dir = __dirname

# Some defaults true to all tests.
defaults = (test) ->
    src: [ "test/fixtures/#{test}/src/**/*.{coffee,js,eco}" ]
    dest: "test/fixtures/#{test}/build/app.actual.js"

# The individual Grunt task options extending the defaults.
tests =
    apps_c:
        commonjs_test_pass: (test) ->
            [
                options:
                    main: "test/fixtures/#{test}/src/index.js"
                    name: 'TestApp'
            , ([ a, b ], cb) ->
                _.each errors, assert.ifError
                assert.equal a, b
                do cb
            ]

        commonjs_test_noname: (test) ->
            [
                options:
                    main: "test/fixtures/#{test}/src/index.js"
            , ([ a, b ], cb) ->
                assert errors.length
                do cb
            ]

        commonjs_test_nomain: (test) ->
            [
                options:
                    name: 'TestApp'
            , ([ a, b ], cb) ->
                _.each errors, assert.ifError
                assert.equal a, b
                do cb
            ]

        commonjs_test_noindex: (test) ->
            [
                options:
                    name: 'TestApp'
            , ([ a, b ], cb) ->
                assert errors.length
                do cb
            ]

        commonjs_test_names: (test) ->
            [
                options:
                    name: [ 'TestApp', 'MyApp' ]
            , ([ a, b ], cb) ->
                _.each errors, assert.ifError
                assert.equal a, b
                do cb
            ]            

# Export Mocha tests.
for test, options of tests.apps_c then do (test, options) ->
    # Create the config proper.
    [ opts, handler ] = options test
    tests.apps_c[test] = _.extend defaults(test), opts

    exports[test] = (done) ->
        console.log '\n'

        # Run the task.
        async.waterfall [
            _.partial(grunt.tasks, [ 'verbosity', 'apps_c:' + test ], {})

        # Load actual & expected.
        , (cb) ->
            async.map [ 'app.actual.js', 'app.expected.js' ], (name, cb) ->
                fs.readFile dir + '/fixtures/' + test + '/build/' + name, 'utf-8', (err, file) ->
                    # Silence!
                    cb null, file
            , cb

        # Compare sending it to a handler.
        , handler

        # Cleanup.
        , (cb) ->
            errors = []
            fs.unlink dir + '/fixtures/' + test + '/build/app.actual.js', (err) ->
                # Silence!
                do cb

        ], (err) ->
            assert.ifError err
            do done

# Init the config inside Grunt.
grunt.initConfig _.extend tests,
    verbosity:
        default:
            options:
                mode: 'hidden'
            tasks: [ 'apps_c' ]