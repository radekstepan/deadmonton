class View extends Backbone.View

    autorender: no

    constructor: ->
        super

        @views = []

        do @render if @autorender

    render: -> @

module.exports = View