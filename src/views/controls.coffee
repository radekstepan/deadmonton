class Controls extends Backbone.View

    el: '#controls'

    template: JST.controls

    events:
        'click .icon.play': 'onPlay'
        'click .icon.pause': 'onPlay'

    # Play/pause.
    onPlay: (evt) ->
        $(@el).find('.play, .pause').toggleClass('active')

    render: ->
        $(@el).html Mustache.render @template, {}

        @

module.exports = Controls