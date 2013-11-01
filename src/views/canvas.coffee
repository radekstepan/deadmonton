config   = require '../config'
mediator = require '../modules/mediator'

class Canvas extends Backbone.View

    el: '#map'

    constructor: ->
        super

        # Set/reset.
        do @reset

        # Select the canvas.
        canvas = document.getElementById("canvas")
        @ctx = canvas.getContext("2d")

        # Canvas size.
        $('#canvas')
        .attr('width', config.window.width)
        .attr('height', config.window.height)

        # Listeners.
        mediator.on 'play', @play, @
        mediator.on 'pause', @pause, @
        mediator.on 'replay', @reset, @

    # Center map over Edmonton.
    render: ->
        # Set size.
        $(@el)
        .css('width', "#{config.window.width}px")
        .css('height', "#{config.window.height}px")

        @map = new L.Map 'map',
            'center': new L.LatLng(53.5501, -113.5049),
            'zoom': 12
            'zoomControl': no

        L.tileLayer.provider('Stamen.Toner').addTo @map

    # Play the show.
    play: ->
        date = $('#date')

        # Range replay.
        @i1 = setInterval =>

            # Have we reached the end?
            return do @stop if @now > @end

            # Show the new date.
            date.html @now.format("ddd, Do MMMM YYYY")

            # Get today's events from today.
            go = yes
            while go and @index < @collection.length
                # Peak.
                if @now >= new Date (particle = @collection[@index]).t
                    # How many ticks do I live for?
                    particle.ttl = 10
                    # Save the particle location.
                    particle.point = @map.latLngToLayerPoint particle.l
                    # The color?
                    particle.color = config.colors[particle.c].join(',')
                    # Add to the stack.
                    @particles.push particle
                    # Move index.
                    @index += 1
                else
                    go = no

            # Move by 1 day.
            @now = @now.add('d', 1)
        
        , 2e2 # how quickly to change days

        # Meanwhile we are rendering the particles on canvas.
        @i2 = setInterval =>

            # Disappear previous frame.
            @ctx.globalCompositeOperation = "source-out"
            # Background opacity.
            @ctx.fillStyle = "rgba(0,0,0,0.1)"
            @ctx.fillRect 0, 0, config.window.width, config.window.height
            # Blend the particles.
            @ctx.globalCompositeOperation = 'darker'

            for particle in @particles
                { point, color } = particle

                rad = particle.ttl

                gradient = @ctx.createRadialGradient point.x, point.y, 0, point.x, point.y, rad
                gradient.addColorStop 0.0, "white"
                gradient.addColorStop 0.8, "rgba(#{color},0.5)"
                gradient.addColorStop 1.0, "black"

                # Begin.
                do @ctx.beginPath

                @ctx.fillStyle = gradient
                @ctx.arc point.x, point.y, rad, 0, Math.PI * 2, no

                # End.
                do @ctx.closePath
                do @ctx.fill

                # One tick less.
                particle.ttl -= 0.1 if particle.ttl > 3

        , 33 # fps

    # Clear the timeouts for a while.
    pause: ->
        ( clearInterval(i) for i in [ @i1, @i2 ] )

    # Stop the show.
    stop: ->
        do @pause
        @particles = []
        @index = 0
        # Change controls.
        mediator.trigger 'stop'

    # Replay.
    reset: ->
        do @pause

        # The time range.
        @now = moment new Date @collection[0].t
        @end = moment new Date @collection[@collection.length - 1].t
        
        # The particles.
        @particles = []
        @index = 0

module.exports = Canvas