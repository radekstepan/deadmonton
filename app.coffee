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
# Disappear previous frame.
ctx.globalCompositeOperation = "source-over"
# Blend the particles.
ctx.globalCompositeOperation = "lighter"
# Background opacity.
ctx.fillStyle = "rgba(0,0,0,0.3)"
ctx.fillRect 0, 0, width, height

# Get the data.
superagent.get 'data/crime.json', (res) ->
    # Show Edmonton.
    map = L.map('map').setView([ 53.5501, -113.5049 ], 11);

    # Render the map.
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map)

    # For each point.
    _.each res.body[0...2], (event) ->
        # Get the location.
        { x, y } = map.latLngToLayerPoint event.loc

        div = document.createElement 'div'
        div.className = 'point'
        div.style.left = "#{x}px"
        div.style.top = "#{y}px"
        document.body.appendChild div

        # Draw the particle.
        do ctx.beginPath

        gradient = ctx.createRadialGradient x, y, 0, x, y, 5
        gradient.addColorStop 0, "white"
        gradient.addColorStop 1, "hotpink"

        ctx.fillStyle = gradient
        ctx.arc x, y, 5, 0, Math.PI * 2, no

        do ctx.closePath
        do ctx.fill