View     = require '../modules/view'
config   = require '../config'

Category = require './category'

class Categories extends View

    el: '#categories'

    autorender: yes

    constructor: ->
        super

    render: ->
        # Render a list of categories as subviews.
        for name, data of config.categories
            @views.push view = new Category({
                'model': _.extend data, { name }
            })
            $(@el).append view.el

        @

module.exports = Categories