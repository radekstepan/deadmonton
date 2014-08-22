module.exports =

    # Color translation table (ColorBrewer YlOrRd).
    'categories':
        'Theft From Vehicle':
            'rgb': [ 255, 237, 160 ]
            'active': yes
            'seriousness': 1
        'Theft Of Vehicle':
            'rgb': [ 254, 217, 118 ]
            'active': yes
            'seriousness': 2
        'Theft Over $5000':
            'rgb': [ 254, 217, 118 ]
            'active': yes
            'seriousness': 2
        
        'Break and Enter':
            'rgb': [ 253, 141, 60 ] # burglary
            'active': yes
            'seriousness': 4
        'Robbery':
            'rgb': [ 253, 141, 60 ]
            'active': yes
            'seriousness': 6

        'Assault':
            'rgb': [ 227, 26, 28 ]
            'active': yes
            'seriousness': 8
        'Sexual Assaults':
            'rgb': [ 227, 26, 28 ]
            'active': yes
            'seriousness': 10

        'Homicide':
            'rgb': [ 0, 0, 0 ]
            'active': yes
            'seriousness': 50

    # Available area.
    'window':
        'width':  do $(window).width
        'height': do $(window).height

    # Center of the map.
    'center':
        [ 53.5501, -113.5049 ]