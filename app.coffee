# Color translation table (ColorBrewer YlOrRd).
colors =
    'Theft From Vehicle': [ 255, 237, 160 ]
    'Theft Of Vehicle': [ 254, 217, 118 ]
    'Theft Over $5000': [ 254, 217, 118 ]
    
    'Break and Enter': [ 253, 141, 60 ] # burglary
    'Robbery': [ 253, 141, 60 ]

    'Assault': [ 227, 26, 28 ]
    'Sexual Assaults': [ 227, 26, 28 ]

    'Homicide': [ 0, 0, 0 ]

# Set available area for map & canvas.
{ width, height } = document.querySelector('body').getBoundingClientRect()

el = document.querySelector('#map')
el.style.width = "#{width}px"
el.style.height = "#{height}px"

el = document.querySelector('#canvas')
el.width = width
el.height = height

canvas = document.getElementById("canvas")
ctx = canvas.getContext("2d")

# Get the data.
superagent.get 'data/crime.json', (res) ->
    # Filter the set.
    # res.body = _.filter res.body, { 'type': 'Theft Over $5000' }

    # Show Edmonton.
    # map = L.map('map').setView([ 53.5501, -113.5049 ], 12);
    # L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    #     attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    # }).addTo(map)
    
    map = new L.Map 'map',
        'center': new L.LatLng(53.5501, -113.5049),
        'zoom': 12
    map.addLayer(new L.StamenTileLayer('toner'))

    # The particles.
    particles = []

    # The time range.
    a = moment new Date res.body[0].date
    b = moment new Date res.body[res.body.length - 1].date

    diff = b.diff a, 'days'

    date = document.querySelector('#date')

    # Range replay.
    i1 = setInterval ->

        # Have we reached the end?
        return ( clearInterval(i) for i in [ i1, i2 ] ) if a > b

        # Show the new date.
        date.innerHTML = a.format("ddd, Do MMMM YYYY")

        # Shift today's events from the queue.
        go = yes
        while go and res.body.length
            if a >= new Date res.body[0].date
                particle = do res.body.shift
                # How many ticks do I live for?
                particle.ttl = 10
                # Save the particle location.
                particle.point = map.latLngToLayerPoint particle.loc
                # The color?
                particle.color = colors[particle.type].join(',')
                # Add to the stack.
                particles.push particle
            else
                go = no

        # Move by 1 day.
        a = a.add('d', 1)
    
    , 2e2

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

    , 33