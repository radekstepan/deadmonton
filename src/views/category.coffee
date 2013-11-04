View     = require '../modules/view'
mediator = require '../modules/mediator'
config   = require '../config'

class Category extends View

    autorender: yes

    tagName: 'li'

    template: require '../templates/category'

    events:
        'click': 'onToggle'

    render: ->
        # Render the category from a Model.
        (el = $(@el)).html @template @model

        # Initial active status.
        el.addClass 'active' if @model.active

        @

    onToggle: ->
        $(@el).toggleClass 'active'
        @model.active = !@model.active

        mediator.trigger('redraw')

module.exports = Category