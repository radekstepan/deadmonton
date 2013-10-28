req    = require 'request'
async  = require 'async'
moment = require 'moment'
fs     = require 'fs'
_      = require 'lodash'

# Get the data files.
async.waterfall [ (cb) ->
    async.map [ 'hoods', 'crime' ], (name, cb) ->
        fs.readFile "./data/#{name}.json", 'utf-8', (err, data) ->
            # Parse.
            ( try data = JSON.parse data ) unless err
            # Silently done.
            cb null, data
    , cb

# Generate the tasks.
, (data, cb) ->
    # Explode.
    [ hoods, crime ] = data

    return cb 'No hoods, go get them from the police' unless hoods

    crime ?= []

    # The range of time in question.
    b = do moment
    a = b.clone().subtract(60, 'd')

    # Do we already have data?
    if (length = crime.length)
        # Start from the last day saved.
        a    = moment crime[length - 1].t
        last = do new Date(a).toJSON
        # Plop the data from the last day so we can easily merge.
        done = no
        while not done
            if crime[length - 1].t is last
                do crime.pop
                length -= 1
            else
                done = yes

    # One hoodful.
    one = (id, hood) ->
        host = 'crimemapping.edmontonpolice.ca'
        opts =
            # All crimes.
            crimeTypes: [ 'Assault', 'Sexual Assaults', 'Break and Enter',
                'Theft From Vehicle', 'Homicide', 'Theft Of Vehicle',
                'Robbery', 'Theft Over $5000' ].join(';')
            # For this hood.
            neighbourhoodID: id
            # In this time range.
            strStartDate: a.format("YYYY,MM,DD")
            strEndDate: b.format("YYYY,MM,DD")
        
        # Actually run it.
        (cb) ->
            console.log hood

            req
                uri: "http://#{host}/DataProvider.asmx/getOccurrenceInfo"
                method: 'POST'
                json: opts
                headers:
                    'Host': host
                    'Origin': "http://#{host}"
                    'Referrer': "http://#{host}/"
                    'Content-Type': 'application/json; charset=UTF-8'
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36
                        (KHTML, like Gecko) Ubuntu Chromium/28.0.1500.71
                        Chrome/28.0.1500.71 Safari/537.36'
            , (err, res) ->
                throw err if err
                
                # Turn to an array.
                all = []
                _.each res.body.d, (item) ->
                    l = [ item.Location.Lat, item.Location.Lon ]
                    _.each item.Occurrences, (occurence) ->
                        [ description, date ] = occurence.Description.match(/^([^\(]*)\((.*)\)$/)[1..2]
                        all.push {
                            # Description/title.
                            'd': do description.trim
                            # Time/date.
                            't': new Date date
                            # Class/type.
                            'c': occurence.OccurrenceTypeGroup
                            # Location.
                            l
                        }

                # Return.
                cb null, all

    # Throttle 5 at a time, don't want mounties to go all red alert.
    async.parallelLimit ( one(id, hood) for id, hood of hoods ), 5, (err, results) ->
        return cb err if err

        # Flatten and sort.
        sorted = _(results).flatten().sortBy('t').value()

        # Merge them with the previous data.
        cb null, crime.concat(sorted)


, (results, cb) ->
    # Write.
    fs.writeFile './data/crime.json'
    , JSON.stringify(results), { 'flags': 'w' }, cb

], (err, results) ->
    throw err if err