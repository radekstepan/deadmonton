module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        coffee_build:
            options:
                main: 'src/index.js'
            browser:
                options:
                    dest: 'build/browser.js'

    grunt.loadNpmTasks('grunt-coffee-build')

    grunt.registerTask('default', [ 'coffee_build' ])