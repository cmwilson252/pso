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
    let currentQuests = null;
    let challengeMode = false;
    
    function setupQuests() {
        let questsToAdd = [];
        quests.forEach(function (quest) {
            if (quest.is_teamz_enabled) {
                if (quest.is_cmode == challengeMode) {
                    questsToAdd.push({
                        name: quest.name,
                        value: quest.id,
                    });
                }
            }
        });
        
        currentQuests = questsToAdd;
        $('#quest_list').dropdown({
            values: currentQuests,
        });
        $('#quest_list').removeClass('loading');
    }
    
    function setupPlayers() {
        $('#player_list').dropdown({
            allowAdditions: true,
        });
    }
    
    function setupGeneration() {
        $('#challenge_mode').checkbox({
            onChange: function() {
                challengeMode = $('#challenge_mode').checkbox('is checked');
                setupQuests();
            }
        });
        $('#generate_quest').on('click', function () {
            generateQuest();
        });
        $('#generate_parties').on('click', function () {
            generateParties();
        });
    }
    
    function generateQuest() {
        let excludedQuests = $('#quest_list').dropdown('get values');
        let questsToRandomize = [];
        
        excludedQuests = Array.isArray(excludedQuests) ? excludedQuests : [excludedQuests];
        
        currentQuests.forEach(function (quest) {
            if (!excludedQuests.includes(quest.value)) {
                questsToRandomize.push(quest.name);
            }
        });
        
        let selectedQuest = questsToRandomize.random();
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
