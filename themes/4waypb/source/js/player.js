window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.players = window.fourwaypb.players || {};

window.fourwaypb.players.ready = function() {
    
    let ready = false;
    let players = null;
    
    function updateColumns() {
        $('.cards').removeClass('one two three four');
        if (window.innerWidth <= 375) {
            $('.cards').addClass('one');
        } else if (window.innerWidth <= 640) {
            $('.cards').addClass('two');
        } else {
            $('.cards').addClass('three');
        }
    }
    
    function addCard(player) {
        $('#players').append(
            $('<div/>', {
                'class': 'card',
            }).append(
                $('<a/>', {
                    'class': 'ui large image',
                    'href': url_for('player?id='+player.id),
                }).append(
                    $('<img/>', {
                        'src': /^https?:\/\//.test(player.image) ? player.image : url_for(player.image)
                    })
                ),
                $('<div/>', {
                    'class': 'content',
                }).append(
                    $('<a/>', {
                        'class': 'header',
                        'href': url_for('player?id='+player.id),
                        'text': player.name,
                    }),
                    $('<div/>', {
                        'class': 'meta',
                        'text': 'meta',
                    }),
                    $('<div/>', {
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
                        if (player.youtube.name && player.youtube.url) {
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
                        if (player.twitch.name && player.twitch.url) {
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

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.players.ready();
});
