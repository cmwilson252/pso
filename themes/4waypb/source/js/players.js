window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.players = window.fourwaypb.players || {};

// ready event
window.fourwaypb.players.ready = function() {
    
    let ready = false;
    let players = null;
    
    // TODO remove if not used
    function classKeyToName(key) {
        switch (key) {
            case 'humar':       return 'HUmar';
            case 'hunewearl':   return 'HUnewearl';
            case 'hucast':      return 'HUcast';
            case 'hucaseal':    return 'HUcaseal';
            case 'ramar':       return 'RAmar';
            case 'ramarl':      return 'RAmarl';
            case 'racast':      return 'RAcast';
            case 'racaseal':    return 'RAcaseal';
            case 'fomar':       return 'FOmar';
            case 'fomarl':      return 'FOmarl';
            case 'fonewm':      return 'FOnewm';
            case 'fonewearl':   return 'FOnewearl';
            default: return "Unknown";
        }
    }
    
    function updateColumns() {
        $('.cards').removeClass('one two three four');
        if (window.innerWidth < 640) {
            $('.cards').addClass('one');
        } else if (window.innerWidth < 992) {
            $('.cards').addClass('two');
        } else if (window.innerWidth < 1200) {
            $('.cards').addClass('three');
        } else {
            $('.cards').addClass('four');
        }
    }
    
    function addCard(player) {
        $('#players').append(
            $('<div/>', {
                'class': 'card',
            }).append(
                $('<a/>', {
                    'class': 'ui image',
                    'href': url_for('player?id='+player.id),
                }).append(
                    $('<img/>', {
                        'src': /^https?:\/\//.test(player.image) ? player.image : url_for(player.image),
                    })
                ),
                $('<div/>', {
                    'class': 'content',
                }).append(
                    $('<span/>', {
                        'class': 'ui inverted secondary small text right floated',
                        'text': player.timezone,
                    }),
                    $('<a/>', {
                        'class': 'header',
                        'href': url_for('player?id='+player.id),
                        'text': player.name,
                    }),
                    $('<div/>', {
                        'class': 'meta',
                    }).append(
                        $('<span/>', {
                            'html': (function() {
                                let content = '';
                                for (let i = 0; i < player.metas.length; i++) {
                                    if (i > 0) {
                                        content += ', ';
                                    }
                                    content += player.metas[i];
                                }
                                return content;
                            }),
                        }),
                        $('<br/>'),
                        $('<span/>', {
                            'html': (function() {
                                let content = '';
                                for (let i = 0; i < player.classes.length; i++) {
                                    if (i > 0) {
                                        content += ', ';
                                    }
                                    content += classKeyToName(player.classes[i]);
                                }
                                return content;
                            }),
                        }),
                        $('<br/>'),
                        $('<span/>', {
                            'text': (function() {
                                let content = '';
                                //for (let i = 0; i < player.teams.length; i++) {
                                //    if (i > 0) {
                                //        content += ', ';
                                //    }
                                //    content += player.teams[i];
                                //}
                                return content;
                            }),
                        }),
                        $('<br/>'),
                        $('<br/>'),
                    ),
                    $('<span/>', {
                        'class': 'description',
                        'html': (function() {
                            let content = '';
                            player.card_content.forEach(function(line){
                                content += line;
                            });
                            return content;
                        }),
                    }),
                ),
                $('<div/>', {
                    'class': 'extra content',
                }).append(
                    (function() {
                        let float = false;
                        let result = [];
                        
                        if (player.discord) {
                            result.push(
                                $('<span/>', {
                                }).append(
                                    $('<i/>', {
                                        'class': 'icon discord',
                                    }),
                                    player.discord,
                                ),
                                $('<br />')
                            );
                        }
                        if (player.twitter) {
                            result.push(
                                $('<a/>', {
                                    'href': 'https://twitter.com/'+player.twitter,
                                }).append(
                                    $('<i/>', {
                                        'class': 'icon twitter',
                                    }),
                                    $('<span/>', {
                                        'text': '@'+player.twitter,
                                    }),
                                ),
                                $('<br />')
                            );
                        }
                        if (player.youtube && player.youtube.name && player.youtube.url) {
                            result.push(
                                $('<a/>', {
                                    'href': player.youtube.url,
                                }).append(
                                    $('<i/>', {
                                        'class': 'icon youtube',
                                    }),
                                    $('<span/>', {
                                        'text': player.youtube.name,
                                    }),
                                ),
                                $('<br />')
                            );
                        }
                        if (player.twitch && player.twitch.name && player.twitch.url) {
                            result.push(
                                $('<a/>', {
                                    'href': player.twitch.url,
                                }).append(
                                    $('<i/>', {
                                        'class': 'icon twitch',
                                    }),
                                    $('<span/>', {
                                        'text': player.twitch.name,
                                    }),
                                ),
                                $('<br />')
                            );
                        }
                        if (player.github && player.github.name && player.github.url) {
                            result.push(
                                $('<a/>', {
                                    'href': player.github.url,
                                }).append(
                                    $('<i/>', {
                                        'class': 'icon github',
                                    }),
                                    $('<span/>', {
                                        'text': player.github.name,
                                    }),
                                ),
                                $('<br />')
                            );
                        }
                        
                        return result;
                    }),
                ),
            ),
        );
    }
    
    function setupPage() {
        players.forEach(function(player) {
            if (player.id) {
                addCard(player);
            }
        });
        
        $(window).on('resize', _.debounce(function () {
            updateColumns();
        }, 250));
        updateColumns();
    };
    
    getJSON5(url_for('data/players.json'), (function(data) {
        players = data;
        
        setupPage();
        
        ready = true;
        console.log('Page ready');
    }));
};

// attach ready event
window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.players.ready();
});
