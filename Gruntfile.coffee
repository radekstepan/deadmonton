module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        coffee_build:
            options:
                main: 'src/index.js'
            browser:
                options:
                    dest: 'build/app.js'

        stylus:
            compile:
                options:
                    paths: [ 'src/app.styl' ]
                files:
                    'build/app.css': 'src/app.styl'

    grunt.loadNpmTasks('grunt-coffee-build')
    grunt.loadNpmTasks('grunt-contrib-stylus')

    grunt.registerTask('default', [ 'coffee_build', 'stylus' ])