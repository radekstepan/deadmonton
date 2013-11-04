module.exports =

    # Color translation table (ColorBrewer YlOrRd).
    'categories':
        'Theft From Vehicle':
            'rgb': [ 255, 237, 160 ]
            'active': yes
        'Theft Of Vehicle':
            'rgb': [ 254, 217, 118 ]
            'active': yes
        'Theft Over $5000':
            'rgb': [ 254, 217, 118 ]
            'active': yes
        
        'Break and Enter':
            'rgb': [ 253, 141, 60 ] # burglary
            'active': yes
        'Robbery':
            'rgb': [ 253, 141, 60 ]
            'active': yes

        'Assault':
            'rgb': [ 227, 26, 28 ]
            'active': yes
        'Sexual Assaults':
            'rgb': [ 227, 26, 28 ]
            'active': yes

        'Homicide':
            'rgb': [ 0, 0, 0 ]
            'active': yes

    # Available area.
    'window':
        'width':  do $(window).width
        'height': do $(window).height

    # Center of the map.
    'center':
        [ 53.5501, -113.5049 ]