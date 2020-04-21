window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.teamz_results = window.fourwaypb.teamz_results || {};

window.fourwaypb.teamz_results.ready = function() {
    
    let ready = false;
    let events = null;
    
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
    
    function createResult(event) {
        return $('<div/>', {
            'class': 'ui inverted segment',
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
    
    function setupPage() {
        $('#teamz-results-container').empty().append(
            $.map(events, function(event) {
                return [
                    createResult(event),
                    $('<div/>', {
                        'class': 'ui hidden divider',
                    }),
                ];
            }),
        );
        
        $(window).on('resize', _.debounce(function () {
            updateColumns();
        }, 250));
        updateColumns();
    };
    
    getJSON5(url_for('data/teamz.json'), (function(data) {
        events = data;
        
        setupPage();
        
        ready = true;
        console.log('Page ready');
    }));
};

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.teamz_results.ready();
});
