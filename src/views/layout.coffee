Controls = require './controls'
Canvas   = require './canvas'
mediator = require '../modules/mediator'

class Layout extends Backbone.View

    el: 'body'

    template: JST.layout

    constructor: ->
        super
        @views = []

        # Remove sign when done loading.
        mediator.on 'loaded', ->
            do $(@el).find('#loading').hide
        , @

        # Get the data.
        $.getJSON 'data/crime.json', (collection) =>
            do (new Canvas({ collection })).render
            mediator.trigger 'loaded'

    render: ->
        $(@el).html Mustache.render @template, {}
        
        # Add map controls.
        do (new Controls()).render

        @

module.exports = Layout