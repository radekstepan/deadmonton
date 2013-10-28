mediator = require '../modules/mediator'

class Controls extends Backbone.View

    el: '#controls'

    template: JST.controls

    events:
        'click .icon.play': 'onPlay'
        'click .icon.pause': 'onPlay'

    constructor: ->
        super

        # Enable play button when loaded.
        mediator.on 'loaded', ->
            $(@el).find('.icon.play').addClass('active')
        , @

    # Play/pause.
    onPlay: (evt) ->
        # Toggle buttons.
        $(@el).find('.play, .pause').toggleClass('active')
        # Trigger play.
        mediator.trigger 'play'

    render: ->
        $(@el).html Mustache.render @template, {}

        @

module.exports = Controls