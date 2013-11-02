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
        mediator.on 'redraw', @redraw, @

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

        # When the user starts moving with the map.
        @map.on 'movestart', =>
            # Pause the drawing.
            mediator.trigger 'pause'

            # Clear the frame, completely.
            @frame yes

        # When the user lets go of the map.
        @map.on 'moveend', =>
            # Nothing to update?
            return unless @particles.length

            # For all particles...
            for particle in @particles
                # Update the location of all particles.
                particle.point = @position particle.l
                # Force a re-draw without reducing ttl.
                @draw particle
        
        # Add Stamen Toner tiles to the map.
        L.tileLayer.provider('Stamen.Toner').addTo @map

    # Latitude/longitude to a canvas location.
    position: (latLng) ->
        @map.layerPointToContainerPoint @map.latLngToLayerPoint latLng

    # Render a new frame.
    frame: (reset=no)->
        method = [ 'source-out', 'copy' ][+reset]

        # Overlay previous frame.
        @ctx.globalCompositeOperation = method
        # Background opacity.
        @ctx.fillStyle = "rgba(0,0,0,0.1)"
        @ctx.fillRect 0, 0, config.window.width, config.window.height
        # Blend the particles.
        @ctx.globalCompositeOperation = 'darker'

    # Draw a single particle.
    draw: (particle) =>
        { point, ttl } = particle

        # Skip if the location is off map.
        return if point.x < 0 or point.y < 0

        # Skip if our category is not toggled.
        return unless config.categories[particle.c].active

        radius = ttl * 0.1 * do @map.getZoom

        # Make the gradient.
        gradient = @ctx.createRadialGradient point.x, point.y, 0, point.x, point.y, radius
        gradient.addColorStop 0.0, "white"
        gradient.addColorStop 0.8, "rgba(#{particle.color},0.5)"
        gradient.addColorStop 1.0, "black"

        # Begin.
        do @ctx.beginPath

        @ctx.fillStyle = gradient
        @ctx.arc point.x, point.y, radius, 0, Math.PI * 2, no

        # End.
        do @ctx.closePath
        do @ctx.fill

    # Play the show.
    play: ->
        @playing = yes

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
                    particle.point = @position particle.l
                    # The color?
                    particle.color = config.categories[particle.c].rgb.join(',')
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

            # Make a new frame.
            do @frame

            # Draw all particles and reduce their ttl.
            for particle in @particles
                @draw particle
                # One tick less.
                particle.ttl -= 0.1 if particle.ttl > 3

        , 33 # fps

    # Clear the timeouts for a while.
    pause: ->
        @playing = no
        _.each [ @i1, @i2 ], clearInterval

    # Stop the show.
    stop: ->
        do @pause
        @playing = no
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

        @playing = no

    # When we toggle a category.
    redraw: ->
        return if @playing

        # Reset the frame.
        @frame yes

        # Force re-draw.
        _.each @particles, @draw

module.exports = Canvas