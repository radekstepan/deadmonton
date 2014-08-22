module.exports = state = new Ractive
    data:
        # What was the last command?
        command: 'stop'
        # Are we playing the animation?
        playing: no
        # Have the data loaded already?
        ready:   no

state.observe 'command', (cmd) ->
    # Switch the playing state based on last command.
    @set 'playing', cmd is 'play'
    # Reset pause so we can pause multiple times.
    @set 'command', 'n/a' if cmd is 'pause'