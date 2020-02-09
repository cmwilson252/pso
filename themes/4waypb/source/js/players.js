window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.players = window.fourwaypb.players || {};

// ready event
window.fourwaypb.players.ready = function() {
    
    let ready = false;
    let players = null;
    
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
            case 'fonewm':      return 'Fonewm';
            case 'fonewearl':   return 'FOnewearl';
            default: return "Unknown";
        }
    }
    
    function addCard(player) {
        $('#something').append(
            $('<div/>', {
                'class': '',
                'text': player.name,
            }).append(
                $('<span/>', {
                    'text': player.name,
                }),
                $('<img/>', {
                    'src': /^https?:\/\//.test(player.image) ? player.image : url_for(player.image),
                })
            ),
        );
    }
    
    function setupPage() {
        players.forEach(function(player) {
            addCard(player);
        });
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
