config = require '../config'
state  = require './state'

Categories = Ractive.extend
    
    template: require '../templates/categories'

    init: ->
        @on 'toggle', (obj) ->
            # Toggle our model.
            @set "#{obj.keypath}.active", !obj.context.active
            # Force redraw when pausing the animation.
            state.set 'command', 'pause'
    
    data:
        'category': config.categories

module.exports = new Categories()