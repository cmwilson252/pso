window.fourwaypb = window.fourwaypb || {};
window.fourwaypb.teamz_generator = window.fourwaypb.teamz_generator || {};

window.fourwaypb.teamz_generator.ready = function() {
    Array.prototype.random = function () {
        return this[Math.floor((Math.random() * this.length))];
    }
    Array.prototype.randomize = function shuffle() {
        var currentIndex = this.length, temporaryValue, randomIndex;
        
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            temporaryValue = this[currentIndex];
            this[currentIndex] = this[randomIndex];
            this[randomIndex] = temporaryValue;
        }
    }
    Array.prototype.chunk = function (len) {
        var chunks = [],
        i = 0,
        n = this.length;
        
        while (i < n) {
            chunks.push(this.slice(i, i += len));
        }
        
        return chunks;
    }
    
    let quests = null;
    function setupQuests() {
        $('#quest_list').dropdown();
    
        quests.forEach(function (quest) {
            $('#quest_list .menu').append(
                $('<div/>', {
                    'class': 'item',
                    'data-value': quest.name,
                    'text': quest.name,
                }),
            );
        })
        $('#quest_list').removeClass('loading');
    }
    
    function setupPlayers() {
        $('#player_list').dropdown({
            allowAdditions: true,
        });
    }
    
    function setupGeneration() {
        $('#generate').on('click', function () {
            generate();
        });
    }
    
    function selectRandomQuest() {
        let activeQuests = $('#quest_list').dropdown('get values');
        if (activeQuests == '') {
            activeQuests = [];
            quests.forEach(function (quest) {
                activeQuests.push(quest.name);
            });
        }
        
        let selectedQuest = activeQuests.random();
        $('#quest_name').text('Quest: '+selectedQuest);
    }
    function generateParties() {
        $('#party_list').empty();
        
        let partyCount = parseInt($('#party_count').dropdown('get value'));
        let classMixer = $('#class_mixer').checkbox('is checked');
        let players = $('#player_list').dropdown('get values');
        
        if (players == '') {
            return;
        }
        
        players.randomize();
        
        let parties = players.chunk(partyCount);
        
        let currentPartyIndex = 0;
        parties.forEach(party => {
            $('#party_list').append(
                $('<div/>', {
                    'class': 'ui inverted card',
                }).append(
                    $('<div/>', {
                        'class': 'content',
                    }).append(
                        $('<div/>', {
                            'class': 'header',
                            'text': 'Party '+(currentPartyIndex+1),
                        }),
                        $('<div/>', {
                            'class': 'description',
                        }).append(
                            $('<ul/>', {}).append(
                                $.map(party, function(player) {
                                    return $('<li/>', {
                                        'text': (function() {
                                            let result = player;
                                            if (classMixer) {
                                                result += ' ['+window.fourwaypb.classKeyToName(window.fourwaypb.psobbClasses.random())+']';
                                            }
                                            return result;
                                        }),
                                    });
                                }),
                            ),
                        ),
                    ),
                ),
            );
            currentPartyIndex++;
        });
    }
    
    function generate() {
        selectRandomQuest();
        generateParties();
    }
    
    getJSON5(url_for('data/quests.json'), (function(data) {
        quests = data;
        setupQuests();
        setupPlayers();
        setupGeneration();
        console.log('Page ready');
    }));
};

window.addEventListener('DOMContentLoaded', function() {
    window.fourwaypb.teamz_generator.ready();
});
