mediator = require '../modules/mediator'
config   = require '../config'

class Categories extends Backbone.View

    el: '#categories'

    template: require '../templates/category'

    events:
        'click li': 'onToggle'

    constructor: ->
        super

    render: ->
        for name, data of config.categories
            $(@el).append @template _.extend data, { name }

        @

    onToggle: (evt) ->
        ref = config.categories[(el = $(evt.target)).data('category')]
        ref.active = !ref.active
        el.toggleClass('active')

        mediator.trigger('redraw')

module.exports = Categories