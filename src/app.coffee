config = require './config'

module.exports = ->
    # Controls.
    controls = {}
    ( controls[name] = $("#controls .icon.#{name}") for name in [ 'rewind', 'play', 'pause' ] )

    # Play/pause.
    for tuple in [
        [ 'play', 'pause' ]
        [ 'pause', 'play' ]
    ] then do (tuple) ->
        [ a, b ] = tuple
        (el = controls[a]).on 'click', ->
            el.removeClass('active')
            controls[b].addClass('active')

    # Set available area for map & canvas.
    { width, height } = document.querySelector('body').getBoundingClientRect()

    $('#map').css('width', "#{width}px").css('height', "#{height}px")
    $('#canvas').attr('width', width).attr('height', height)

    canvas = document.getElementById("canvas")
    ctx = canvas.getContext("2d")

    # Get the data.
    $.getJSON 'data/crime.json', (data) ->
        # Center on Edmonton.    
        map = new L.Map 'map',
            'center': new L.LatLng(53.5501, -113.5049),
            'zoom': 12
            'zoomControl': no
        L.tileLayer.provider('Stamen.Toner').addTo(map)

        # The particles.
        particles = []

        # The time range.
        a = moment new Date data[0].date
        b = moment new Date data[data.length - 1].date

        diff = b.diff a, 'days'

        date = $('#date')

        # Range replay.
        i1 = setInterval ->

            # Have we reached the end?
            return ( clearInterval(i) for i in [ i1, i2 ] ) if a > b

            # Show the new date.
            date.html a.format("ddd, Do MMMM YYYY")

            # Shift today's events from the queue.
            go = yes
            while go and data.length
                # Peak.
                if a >= new Date data[0].date
                    particle = do data.shift
                    # How many ticks do I live for?
                    particle.ttl = 10
                    # Save the particle location.
                    particle.point = map.latLngToLayerPoint particle.loc
                    # The color?
                    particle.color = config.colors[particle.type].join(',')
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
            ctx.globalCompositeOperation = "source-out"
            # Background opacity.
            ctx.fillStyle = "rgba(0,0,0,0.1)"
            ctx.fillRect 0, 0, width, height
            # Blend the particles.
            ctx.globalCompositeOperation = 'darker'

            for particle in particles
                { point, color } = particle

                rad = particle.ttl

                gradient = ctx.createRadialGradient point.x, point.y, 0, point.x, point.y, rad
                gradient.addColorStop 0.0, "white"
                gradient.addColorStop 0.8, "rgba(#{color},0.5)"
                gradient.addColorStop 1.0, "black"

                # Begin.
                do ctx.beginPath

                ctx.fillStyle = gradient
                ctx.arc point.x, point.y, rad, 0, Math.PI * 2, no

                # End.
                do ctx.closePath
                do ctx.fill

                # One tick less.
                particle.ttl -= 0.1 if particle.ttl > 3

        , 33 # fps