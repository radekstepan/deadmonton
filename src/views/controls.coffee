View     = require '../modules/view'
mediator = require '../modules/mediator'

class Controls extends View

    el: '#controls'

    autorender: yes

    # Mouse clicks.
    events:
        'click .icon.play.active': 'onPlay'
        'click .icon.pause.active': 'onPlay'
        'click .icon.replay.active': 'onReplay'

    # We do not autostart.
    playing: no

    constructor: ->
        super

        # Enable play button when loaded.
        mediator.on 'loaded', @onReady, @

        # No moar data.
        mediator.on 'stop', @onStop, @

        # When we pan/zoom the map.
        mediator.on 'pause', @onPause, @

    # Clicking the play/pause button.
    onPlay: (evt) ->
        # Toggle buttons.
        $(@el).find('.play, .pause').toggleClass('active')
        # Toggle state.
        @playing = !@playing

        # We can rewind now as we have most def moved in time.
        $(@el).find('.replay').addClass('active')

        # Trigger the appropriate event.
        mediator.trigger [ 'pause', 'play' ][+@playing]

    # Starting all over again.
    onReplay: (evt) ->
        # Definitely playing.
        @playing = yes

        # The initial state.
        $(@el).find('.play').removeClass('active')
        $(@el).find('.pause').addClass('active')

        # Reset the data.
        mediator.trigger 'replay'
        # Play them again.
        mediator.trigger 'play'

    # Enable play button when data has loaded.
    onReady: ->
        $(@el).find('.icon.play').addClass('active')

    # When we run out of data to show.
    onStop: ->
        # Not playing.
        @playing = no

        # The end state, only play is active.
        $(@el).find('.icon.play, .icon.pause').removeClass('active')
        $(@el).find('.icon.replay').addClass('active')

    # We have pause through no fault of out own.
    onPause: ->
        return unless @playing
        
        # Not playing.
        @playing = no
        
        $(@el).find('.icon.play').addClass('active') 
        $(@el).find('.icon.pause').removeClass('active') 

module.exports = Controls