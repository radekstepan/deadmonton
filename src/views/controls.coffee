canvas = require './canvas'
state  = require './state'

Controls = Ractive.extend
    
    template: require '../templates/controls'

    init: ->
        # Mouse (DOM) events.
        @on 'play', @onPlay
        @on 'pause', @onPlay
        @on 'replay', @onReplay

        # Enable play button when data is loaded.
        state.observe 'ready', (isReady) =>
            do @onReady if isReady

        # Observe the commands.
        state.observe 'command', (newCmd, oldCmd) =>
            return unless oldCmd # initial set fires too
            # Which one?
            switch newCmd
                # No moar data.
                when 'stop' then do @onStop
                # When we pan/zoom the map.
                when 'pause' then do @onPause

    # Clicking the play/pause button.
    onPlay: ->
        # Toggle buttons.
        $(@el).find('.play, .pause').toggleClass('active')

        # We can rewind now as we have most def moved in time.
        $(@el).find('.replay').addClass('active')

        # Trigger the appropriate event.
        state.set 'command', [ 'play', 'pause' ][+state.get('playing')]

    # Starting all over again.
    onReplay: ->
        # The initial state.
        $(@el).find('.play').removeClass('active')
        $(@el).find('.pause').addClass('active')

        # Reset the data.
        state.set 'command', 'replay'
        # Play them again.
        state.set 'command', 'play'

    # Enable play button when data has loaded.
    onReady: ->
        $(@el).find('.icon.play').addClass('active')

    # When we run out of data to show.
    onStop: ->
        # The end state, only play is active.
        $(@el).find('.icon.play, .icon.pause').removeClass('active')
        $(@el).find('.icon.replay').addClass('active')

    # We have paused through no fault of our own.
    onPause: ->
        $(@el).find('.icon.play').addClass('active') 
        $(@el).find('.icon.pause').removeClass('active')

module.exports = new Controls()