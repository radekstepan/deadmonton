config   = require '../config'
mediator = require '../modules/mediator'

class Canvas extends Backbone.View

    el: '#map'

    constructor: ->
        super
        
        canvas = document.getElementById("canvas")
        @ctx = canvas.getContext("2d")

        # Canvas size.
        $('#canvas')
        .attr('width', config.window.width)
        .attr('height', config.window.height)

        # Play.
        mediator.on 'play', @play, @

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
        # The particles.
        particles = []

        # The time range.
        a = moment new Date @collection[0].t
        b = moment new Date @collection[@collection.length - 1].t

        diff = b.diff a, 'days'

        date = $('#date')

        self = @

        # Range replay.
        i1 = setInterval ->

            # Have we reached the end?
            return ( clearInterval(i) for i in [ i1, i2 ] ) if a > b

            # Show the new date.
            date.html a.format("ddd, Do MMMM YYYY")

            # Shift today's events from the queue.
            go = yes
            while go and self.collection.length
                # Peak.
                if a >= new Date self.collection[0].t
                    particle = do self.collection.shift
                    # How many ticks do I live for?
                    particle.ttl = 10
                    # Save the particle location.
                    particle.point = self.map.latLngToLayerPoint particle.l
                    # The color?
                    particle.color = config.colors[particle.c].join(',')
                    # Add to the stack.
                    particles.push particle
                else
                    go = no

            # Move by 1 day.
            a = a.add('d', 1)
        
        , 2e2 # how quickly to change days

        # Meanwhile we are rendering the particles on canvas.
        i2 = setInterval ->

            # Disappear previous frame.
            self.ctx.globalCompositeOperation = "source-out"
            # Background opacity.
            self.ctx.fillStyle = "rgba(0,0,0,0.1)"
            self.ctx.fillRect 0, 0, config.window.width, config.window.height
            # Blend the particles.
            self.ctx.globalCompositeOperation = 'darker'

            for particle in particles
                { point, color } = particle

                rad = particle.ttl

                gradient = self.ctx.createRadialGradient point.x, point.y, 0, point.x, point.y, rad
                gradient.addColorStop 0.0, "white"
                gradient.addColorStop 0.8, "rgba(#{color},0.5)"
                gradient.addColorStop 1.0, "black"

                # Begin.
                do self.ctx.beginPath

                self.ctx.fillStyle = gradient
                self.ctx.arc point.x, point.y, rad, 0, Math.PI * 2, no

                # End.
                do self.ctx.closePath
                do self.ctx.fill

                # One tick less.
                particle.ttl -= 0.1 if particle.ttl > 3

        , 33 # fps

module.exports = Canvas