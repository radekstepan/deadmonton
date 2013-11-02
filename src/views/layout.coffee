mediator   = require '../modules/mediator'

Controls   = require './controls'
Categories = require './categories'
Canvas     = require './canvas'

class Layout extends Backbone.View

    el: 'body'

    template: require '../templates/layout'

    constructor: ->
        super
        @views = []

        # Remove sign when done loading.
        mediator.on 'loaded', ->
            do $(@el).find('#loading').hide
        , @

        # Get the data.
        $.get 'data/crime.json.lzma', (i) ->
            LZMA.decompress i.split(','), (o) ->

                collection = JSON.parse o
                
                do (new Canvas({ collection })).render
                mediator.trigger 'loaded'

    render: ->
        $(@el).html do @template
        
        # Add map controls.
        do (new Controls()).render
        do (new Categories()).render

        @

module.exports = Layout