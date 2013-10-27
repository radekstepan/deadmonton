Controls = require './controls'

class Layout extends Backbone.View

    el: 'body'

    template: JST.layout

    constructor: ->
        super
        @views = []

    render: ->
        $(@el).html Mustache.render @template, {}

        @views.push view = new Controls()
        do view.render

        @

module.exports = Layout