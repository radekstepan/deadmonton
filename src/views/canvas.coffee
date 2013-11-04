config   = require '../config'
View     = require '../modules/view'
mediator = require '../modules/mediator'

class Canvas extends View

    el: '#map'

    autorender: yes

    constructor: ->
        super

        # Set/reset.
        do @reset

        # Select the canvas context.
        @ctx = document
        .getElementById("canvas")
        .getContext("2d")

        # Blend the particles.
        @ctx.globalCompositeOperation = 'darker'

        # Set canvas size.
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
        # Set size of the div.
        $(@el)
        .css('width', "#{config.window.width}px")
        .css('height', "#{config.window.height}px")

        # Where to center?
        [ a, b ] = config.center

        # New map.
        @map = new L.Map 'map',
            'center': new L.LatLng(a, b),
            'zoom': 12
            'zoomControl': no

        # Add Stamen Toner tiles to the map.
        L.tileLayer.provider('Stamen.Toner').addTo @map
        
        # When the user starts moving with the map.
        @map.on 'movestart', =>
            # Pause the drawing.
            mediator.trigger 'pause'

            # Clear the frame.
            do @clear

        # When the user lets go of the map.
        @map.on 'moveend', =>
            # Nothing to update? Skip then.
            return unless @particles.length

            # For all particles...
            for particle in @particles
                # Update the location of all particles.
                particle.point = @position particle.l
                # Force a re-draw without reducing ttl.
                @draw particle

    # Convert latitude/longitude to a canvas location.
    position: (latLng) ->
        @map.layerPointToContainerPoint @map.latLngToLayerPoint latLng

    # Clear the frame.
    # This method works best cross-browser.
    clear: ->
        @ctx.clearRect 0, 0, config.window.width, config.window.height

    # Draw a single particle.
    draw: (particle) =>
        { point, ttl } = particle

        # Skip if the location is off map.
        return if point.x < 0 or point.y < 0

        # Skip if our category is not toggled.
        return unless config.categories[particle.c].active

        # How big are we going to get?
        radius = ttl * 0.1 * do @map.getZoom

        # Make the gradient.
        gradient = @ctx.createRadialGradient point.x, point.y, 0, point.x, point.y, radius
        gradient.addColorStop 0.0, "white"
        gradient.addColorStop 0.8, "rgba(#{particle.color},0.5)"
        gradient.addColorStop 1.0, "black"

        # Begin.
        do @ctx.beginPath

        # Make/fill a circle.
        @ctx.fillStyle = gradient
        @ctx.arc point.x, point.y, radius, 0, Math.PI * 2, no

        # End.
        do @ctx.closePath
        do @ctx.fill

    # Play the show.
    play: ->
        # We are active.
        @playing = yes

        # Update this with new date.
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

            # Clear the frame.
            do @clear

            # Draw all particles and reduce their ttl.
            for particle in @particles
                @draw particle
                # One tick less.
                particle.ttl -= 0.1 if particle.ttl > 3

        , 33 # fps

    # Clear the timeouts for a while.
    pause: ->
        @playing = no
        # Stop the show.
        _.each [ @i1, @i2 ], clearInterval

    # Stop the show.
    stop: ->
        # Stop the show
        do @pause
        # Change controls.
        mediator.trigger 'stop'

    # Replay.
    reset: ->
        # Stop the show.
        do @pause

        # The time range.
        @now = moment new Date @collection[0].t
        @end = moment new Date @collection[@collection.length - 1].t
        
        # The particles.
        @particles = []
        # Index in the underlying collection.
        @index = 0

    # When we toggle a category.
    redraw: ->
        return if @playing

        # Clear the frame.
        do @clear

        # Force re-draw.
        _.each @particles, @draw

module.exports = Canvas