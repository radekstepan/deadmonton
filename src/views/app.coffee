View       = require '../modules/view'
mediator   = require '../modules/mediator'

Controls   = require './controls'
Categories = require './categories'
Canvas     = require './canvas'

class App extends View

    el: 'body'

    autorender: yes

    template: require '../templates/layout'

    constructor: ->
        super
        @views = []

        # Remove sign when done loading.
        mediator.on 'loaded', ->
            do $(@el).find('#loading').hide
        , @

        # Get the data.
        $.get 'crime.json.lzma', (i) ->
            # Decompress it.
            LZMA.decompress i.split(','), (o) ->

                collection = JSON.parse o
                
                # Render the canvas and say we are ready.
                new Canvas({ collection })
                mediator.trigger 'loaded'

    render: ->
        $(@el).html do @template
        
        # Add map controls.
        new Controls()
        new Categories()

        @

module.exports = App