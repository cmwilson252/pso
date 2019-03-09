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

let quesListItemTemplate =
'<div class="item" data-value="__VALUE__">__TEXT__</div>';
let partyCardPlayerTemplate =
'                <li>__PLAYER_NAME__</li>';
let partyCardTemplate =
'<div class="ui inverted card">'+
'    <div class="content">'+
'        <div class="header">__PARTY_INDEX__</div>'+
'        <div class="description">'+
'            <ul>'+
'                __PLAYER_LIST__'+
'            </ul>'+
'        </div>'+
'    </div>'+
'</div>';

function setupQuests() {
    $('#quest_list').dropdown();

    questListData.forEach(function (quest) {
        let html = quesListItemTemplate;
        html = html.replace('__VALUE__', quest.name);
        html = html.replace('__TEXT__', quest.name);
        $('#quest_list .menu').append(html);
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
        questListData.forEach(function (quest) {
            activeQuests.push(quest.name);
        })
    }
    
    let selectedQuest = activeQuests.random();
    $('#quest_name').text('Quest: '+selectedQuest);
}
function generateParties() {
    $('#party_list').empty();
    
    let partyCount = parseInt($('#party_count').dropdown('get value'));
    let players = $('#player_list').dropdown('get values');
    
    if (players == '') {
        return;
    }
    
    players.randomize();
    
    let parties = players.chunk(partyCount);
    
    let currentPartyIndex = 0;
    parties.forEach(party => {
        let html = partyCardTemplate;
        let htmlPartyPlayers = '';
        
        party.forEach(player => {
            htmlPartyPlayers += partyCardPlayerTemplate.replace('__PLAYER_NAME__', player);
        });
        
        currentPartyIndex++;
        html = html.replace('__PARTY_INDEX__', 'Party '+currentPartyIndex);
        html = html.replace('__PLAYER_LIST__', htmlPartyPlayers);
        $('#party_list').append(html);
    });
}

function generate() {
    selectRandomQuest();
    generateParties();
}

setupQuests();
setupPlayers();
setupGeneration();
