req    = require 'request'
async  = require 'async'
moment = require 'moment'
fs     = require 'fs'
_      = require 'lodash'

# The range of time in question.
now = do moment
b = now.format("YYYY,MM,DD")
a = now.subtract(60, 'd').format("YYYY,MM,DD")

# Get the hoods.
async.waterfall [ (cb) ->
    fs.readFile './data/hoods.json', 'utf-8', cb

# Generate the tasks.
, (hoods, cb) ->
    try
        hoods = JSON.parse hoods
    catch e
        return cb do e.toString

    one = (id, hood) ->
        host = 'crimemapping.edmontonpolice.ca'
        opts =
            crimeTypes: [ 'Assault', 'Sexual Assaults', 'Break and Enter',
                'Theft From Vehicle', 'Homicide', 'Theft Of Vehicle',
                'Robbery', 'Theft Over $5000' ].join(';')
            neighbourhoodID: id
            strStartDate: a
            strEndDate: b
        
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
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/28.0.1500.71 Chrome/28.0.1500.71 Safari/537.36'
            , (err, res) ->
                throw err if err
                
                # Turn to an array.
                all = []
                _.each res.body.d, (item) ->
                    loc = [ item.Location.Lat, item.Location.Lon ]
                    _.each item.Occurrences, (occurence) ->
                        [ description, date ] = occurence.Description.match(/^([^\(]*)\((.*)\)$/)[1..2]
                        all.push {
                            'description': do description.trim
                            'date': new Date date
                            'type': occurence.OccurrenceTypeGroup
                            loc
                        }

                # Return.
                cb null, all

    async.parallelLimit ( one(id, hood) for id, hood of hoods ), 5, cb

, (results, cb) ->
    # Flatten and sort.
    sorted = _(results).flatten().sortBy('date').value()

    # Write.
    fs.writeFile './data/crime.json'
    , JSON.stringify(sorted, null, 4), { 'flags': 'w' }, cb

], (err, results) ->
    throw err if err