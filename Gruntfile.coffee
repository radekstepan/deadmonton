module.exports = (grunt) ->
    grunt.initConfig
        pkg: grunt.file.readJSON("package.json")
        
        coffee_build:
            options:
                main: 'src/index.js'
            browser:
                options:
                    dest: 'build/app.js'
        
        mustache:
            files:
                src: 'src/templates/'
                dest: 'build/templates.js'
                options:
                    prefix: 'var JST = '
                    postfix: ';'

        stylus:
            compile:
                options:
                    paths: [ 'src/app.styl' ]
                files:
                    'build/app.css': 'src/app.styl'


    grunt.loadNpmTasks('grunt-coffee-build')
    grunt.loadNpmTasks('grunt-mustache')
    grunt.loadNpmTasks('grunt-contrib-stylus')

    grunt.registerTask('default', [ 'coffee_build', 'mustache', 'stylus' ])