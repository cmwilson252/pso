window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.teamz_results = window.fourwaypb.teamz_results || {};

window.fourwaypb.teamz_results.ready = function() {
    
    let ready = false;
    let events = null;
    let seasons = [];
    let current_season = 2;
    
    function updateColumns() {
        $('.cards-container').removeClass('one two three');
        if (window.innerWidth <= 767) {
            $('.cards-container').addClass('two');
        } else if (window.innerWidth <= 991) {
            $('.cards-container').addClass('two');
        } else {
            $('.cards-container').addClass('three');
        }
        
        let cardContainerTitle = $('[data-column-wide]');
        cardContainerTitle.each(function(index, el) {
            $(el).removeClass($(el).data('column-wide'), $(el).data('column-wide-mobile'));
        });
        if (window.innerWidth <= 767) {
            cardContainerTitle.each(function(index, el) {
                $(el).addClass($(el).data('column-wide-mobile'));
            });
        } else {
            cardContainerTitle.each(function(index, el) {
                $(el).addClass($(el).data('column-wide'));
            });
        }
    }
    
    function createSeason(season) {
        let fnSetupResults = setupResults;
        let season_name;
        if (season == 0) {
            season_name = 'Off Season';
        } else {
            season_name = 'Season '+season;
        }
        
        return $('<button/>', {
            'class': 'ui inverted button',
            'text': season_name,
            'data-season': season,
        }).on('click', function() {
            $('#teamz-seasons-container button').removeClass('active');
            $('#teamz-seasons-container button[data-season="'+season+'"]').addClass('active');
            window.location.hash = '#'+season;
            fnSetupResults($(this).data('season'));
        });
    }
    function createResult(event) {
        return $('<div/>', {
        }).append(
            $('<div/>', {
                'class': 'ui grid stacking',
            }).append(
                $('<div/>', {
                    'class': 'row',
                }).append(
                    $('<div/>', {
                        'class': 'seven wide column',
                        'data-column-wide': 'seven wide',
                        'data-column-wide-mobile': 'eight wide',
                    }).append(
                        $('<h2/>', {
                            'text': event.quest.name,
                        }),
                    ),
                    $('<div/>', {
                        'class': 'three wide column',
                        'data-column-wide': 'three wide',
                        'data-column-wide-mobile': 'eight wide',
                    }).append(
                        event.set_game == 0 ? null :
                        $('<h5/>', {
                            'text': 'Game #'+event.set_game,
                        }),
                    ),
                    $('<div/>', {
                        'class': 'three wide column',
                        'data-column-wide': 'three wide',
                        'data-column-wide-mobile': 'eight wide',
                    }).append(
                        $('<h4/>', {
                            'text': event.duration,
                        }),
                    ),
                    $('<div/>', {
                        'class': 'three wide column',
                        'data-column-wide': 'three wide',
                        'data-column-wide-mobile': 'eight wide',
                    }).append(
                        $('<h4/>', {
                            'text': event.date,
                        }),
                    ),
                ),
            ),
            $('<div/>', {
                'class': 'ui three stackable cards cards-container',
            }).append(
                $.map(event.teams, function(team) {
                    return $('<div/>', {
                        'class': 'ui inverted card '+(team.highlight ? 'highlight' : ''),
                    }).append(
                        $('<div/>', {
                            'class': 'content',
                        }).append(
                            event.set_game == 0 ? null :
                            $('<div/>', {
                                'class': 'right floated meta',
                            }).append(
                                $('<span/>', {
                                    'text': team.score.wins+' - '+team.score.losses,
                                }),
                            ),
                            $('<div/>', {
                                'class': 'meta',
                            }).append(
                                $('<span/>', {
                                    'text': team.winner ? '🏆' : '　',
                                    'style': 'margin-right: 10px; font-size: 16px',
                                }),
                                $('<span/>', {
                                    'text': moment.unix(moment.duration().add(team.time, 's').asSeconds()).utc().format('mm:ss'),
                                }),
                                $('<span/>', {
                                    'text': event.quest.is_countdown ? ' remaining' : '',
                                }),
                            ),
                            $('<div/>', {
                                'class': 'description',
                            }).append(
                                $('<table/>', {
                                    'class': 'ui inverted very basic small compact unstackable table',
                                }).append(
                                    $('<tbody/>', {}).append(
                                        $.map(team.players, function(player) {
                                            return $('<tr/>').append(
                                                $('<td/>').append(
                                                    $('<a/>', {
                                                        'href': url_for('player?id='+player.id),
                                                        'text': player.name,
                                                        'class': ' '+(player.is_captain ? 'captain' : ''),
                                                    })
                                                ),
                                                $('<td/>').append(
                                                    $('<span/>', {
                                                        'text': (player.class ? window.fourwaypb.classKeyToName(player.class) : 'N/A'),
                                                    })
                                                ),
                                                $('<td/>').append(
                                                    $('<a/>', {
                                                        'href': player.video,
                                                        'text': 'POV',
                                                        'class': ' '+(player.video ? '' : 'visibility-hidden'),
                                                    })
                                                ),
                                            );
                                        }),
                                    ),
                                ),
                            ),
                        ),
                    );
                }),
            ),
        );
    }
    
    function setupSeasons() {
        seasons = events.map(function(obj) { return obj.season });
        seasons = seasons.filter(function(v, i) { return seasons.indexOf(v) == i });
        seasons.sort(function(a, b) {
            if (a === b) {
                return 0;
            } else if (a === 0) {
                return 1;
            } else if (b === 0) {
                return -1;
            } else {
                return a < b ? -1 : 1;
            }
        });
        
        $('#teamz-seasons-container').empty().append(
            $.map(seasons, function(season) {
                return [
                    createSeason(season),
                ];
            }),
        );
    }
    function setupResults(season) {
        $('#teamz-results-container').empty();
        let season_events = events.filter(function(event) {
            return event.season == season;
        });
        for(let i = 0; i < season_events.length; i++) {
            if (i != 0) {
                $('#teamz-results-container').append(
                    $('<div/>', {
                        'class': 'ui inverted hidden divider',
                    }),
                );
            }
            $('#teamz-results-container').append(
                createResult(season_events[i]),
            );
        }
    }
    
    function setupPage() {
        let selected_season = current_season;
        if (window.location.hash) {
            let url_hash = window.location.hash.substring(1);
            let hash_season = parseInt(url_hash);
            if (seasons.indexOf(hash_season) != -1) {
                selected_season = hash_season;
            }
        }
        
        $('#teamz-seasons-container button[data-season="'+selected_season+'"]').click();
        
        $(window).on('resize', _.debounce(function () {
            updateColumns();
        }, 250));
        updateColumns();
    };
    
    getJSON5(url_for('data/teamz.json'), (function(data) {
        events = data;
        
        setupSeasons();
        //setupResults();
        setupPage();
        
        ready = true;
        console.log('Page ready');
    }));
};

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.teamz_results.ready();
});
