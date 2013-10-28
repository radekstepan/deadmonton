Controls = require './controls'
mediator = require '../core/mediator'

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

    render: ->
        $(@el).html Mustache.render @template, {}

        @views.push view = new Controls()
        do view.render

        @

module.exports = Layout