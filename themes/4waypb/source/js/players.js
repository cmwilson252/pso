window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.players = window.fourwaypb.players || {};

window.fourwaypb.players.ready = function() {
    
    let ready = false;
    let players = null;
    
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
                        $('<span/>', {}).append(
                            $('<span/>', {
                                'class': 'first-place-records',
                                'text': '🏆 '+(player.record_results[1] ? player.record_results[1] : '0'),
                                'title': 'First place records: '+(player.record_results[1] ? player.record_results[1] : '0'),
                            }),
                            $('<span/>', {
                                'text': ' | ',
                            }),
                            $('<span/>', {
                                'class': 'total-entries',
                                'text': '⏱️ '+player.record_count,
                                'title': 'Total entries: '+player.record_count,
                            }),
                        ),
                        $('<br/>'),
                        (function() {
                            let result = [];
                            if (player.metas.length > 0) {
                                result.push($('<span/>', {
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
                                }));
                                result.push($('<br/>'));
                            }
                            
                            if (player.classes.length > 0) {
                                result.push($('<span/>', {
                                    'html': (function() {
                                        let content = '';
                                        for (let i = 0; i < player.classes.length; i++) {
                                            if (i > 0) {
                                                content += ', ';
                                            }
                                            content += window.fourwaypb.classKeyToName(player.classes[i]);
                                        }
                                        return content;
                                    }),
                                }));
                                result.push($('<br/>'));
                            }
                            if (player.teams.length > 0) {
                                result.push($('<div/>').append(
                                    (function() {
                                        let result = [];
                                        for (let i = 0; i < player.teams.length; i++) {
                                            if (i > 0) {
                                                result.push($('<br/>'));
                                            }
                                            result.push($('<span/>', {
                                                'class': 'ui image team-flag',
                                            }).append(
                                                $('<img/>', {
                                                    'src': /^https?:\/\//.test(player.teams[i].image) ? player.teams[i].image : url_for(player.teams[i].image),
                                                })
                                            ));
                                            result.push($('<span/>', {
                                                'text': player.teams[i].name,
                                            }));
                                        }
                                        return result;
                                    }),
                                ));
                                result.push($('<br/>'));
                            }
                            if (player.card_content.length > 0) {
                                result.push($('<span/>', {
                                    'html': (function() {
                                        let content = '';
                                        player.card_content.forEach(function(line){
                                            content += line;
                                        });
                                        return content;
                                    }),
                                }));
                            }
                            return result;
                        })(),
                    ),
                ),
                (function() {
                    let result = [];
                    let elements = [];
                    
                    if (player.discord) {
                        elements.push(
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
                        elements.push(
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
                        elements.push(
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
                        elements.push(
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
                        elements.push(
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
                    
                    if (elements.length == 0) {
                        result = null;
                    } else {
                        result.push($('<div/>', {
                            'class': 'extra content',
                        }).append(
                            elements,
                        ));
                    }
                    
                    return result;
                })(),
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

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.players.ready();
});
