mediator = require '../modules/mediator'

class Controls extends Backbone.View

    el: '#controls'

    template: JST.controls

    events:
        'click .icon.play': 'onPlay'
        'click .icon.pause': 'onPlay'

    constructor: ->
        super

        # We do not autostart.
        @playing = no

        # Enable play button when loaded.
        mediator.on 'loaded', ->
            $(@el).find('.icon.play').addClass('active')
        , @

        mediator.on 'stop', ->
            $(@el).find('.icon.play').removeClass('active') 
            $(@el).find('.icon.pause').removeClass('active') 
            $(@el).find('.icon.replay').addClass('active') 
        , @

    # Play/pause.
    onPlay: (evt) ->
        return unless $(evt.target).hasClass 'active'

        # Toggle buttons.
        $(@el).find('.play, .pause').toggleClass('active')
        # Toggle state.
        @playing = !@playing
        # Trigger event.
        mediator.trigger [ 'pause', 'play' ][+@playing]

    render: ->
        $(@el).html Mustache.render @template, {}

        @

module.exports = Controls