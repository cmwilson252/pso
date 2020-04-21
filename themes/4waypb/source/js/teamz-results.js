window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.teamz_results = window.fourwaypb.teamz_results || {};

window.fourwaypb.teamz_results.ready = function() {
    
    let ready = false;
    let events = null;
    
    function createResult(event) {
        return $('<div/>', {
            'class': 'ui inverted segment',
        }).append(
            $('<div/>', {
                'class': 'ui grid stacking three column',
            }).append(
                $('<div/>', {
                    'class': 'twelve wide column',
                }).append(
                    $('<h2/>', {
                        'text': event.quest.name,
                    }),
                ),
                $('<div/>', {
                    'class': 'two wide column',
                }).append(
                    $('<h3/>', {
                        'text': event.duration,
                    }),
                ),
                $('<div/>', {
                    'class': 'two wide column',
                }).append(
                    $('<h4/>', {
                        'text': event.date,
                    }),
                ),
            ),
            $('<div/>', {
                'class': 'ui three stackable cards',
            }).append(
                $.map(event.teams, function(team) {
                    return $('<div/>', {
                        'class': 'ui inverted card '+(team.winner ? 'winner' : ''),
                    }).append(
                        $('<div/>', {
                            'class': 'content',
                        }).append(
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
                                $('<ul/>', {}).append(
                                    $.map(team.players, function(player) {
                                        return $('<li/>').append(
                                            $('<a/>', {
                                                'href': url_for('player?id='+player.id),
                                                'text': player.name,
                                            })
                                        );
                                    })
                                ),
                            ),
                        ),
                    );
                })
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
