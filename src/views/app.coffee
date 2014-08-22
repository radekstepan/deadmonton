state      = require './state'
controls   = require './controls'
canvas     = require './canvas'
categories = require './categories'

App = Ractive.extend
    
    template: require '../templates/layout'

    init: ->
        # Remove loading sign when data loaded.
        state.observe 'ready', (isReady) =>
            do $(@el).find('#loading').hide if isReady
        
        # Render the map.
        canvas.render '#map'

        # Add map controls.
        controls.render '#controls'
        
        # Add category controls.
        categories.render '#categories'

module.exports = app = new App()

# Get the data now.
$.get 'crime.json.lzma', (i) ->
    # Decompress it.
    LZMA.decompress i.split(','), (o) ->
        # Set the new data on canvas.
        canvas.set 'crime': JSON.parse o
        # Say we are ready.
        state.set 'ready', yes