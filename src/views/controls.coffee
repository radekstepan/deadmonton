mediator = require '../modules/mediator'

class Controls extends Backbone.View

    el: '#controls'

    template: require '../templates/controls'

    events:
        'click .icon.play': 'onPlay'
        'click .icon.pause': 'onPlay'
        'click .icon.replay': 'onReplay'

    constructor: ->
        super

        # We do not autostart.
        @playing = no

        # Enable play button when loaded.
        mediator.on 'loaded', ->
            $(@el).find('.icon.play').addClass('active')
        , @

        mediator.on 'stop', ->
            @playing = no

            $(@el).find('.icon.play').removeClass('active') 
            $(@el).find('.icon.pause').removeClass('active') 
            $(@el).find('.icon.replay').addClass('active') 
        , @

        mediator.on 'pause', ->
            return unless @playing
            
            @playing = no
            
            $(@el).find('.icon.play').addClass('active') 
            $(@el).find('.icon.pause').removeClass('active') 
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

        # We can rewind now.
        $(@el).find('.replay').addClass('active')

    onReplay: (evt) ->
        return unless (el = $(evt.target)).hasClass 'active'

        @playing = yes

        $(@el).find('.play').removeClass('active')
        $(@el).find('.pause').addClass('active')

        mediator.trigger 'replay'
        mediator.trigger 'play'

    render: ->
        $(@el).html do @template

        @

module.exports = Controls