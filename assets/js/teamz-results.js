function populateTeamPlayer(container, player) {
    let cardPlayersListItem = document.createElement('li');
    cardPlayersListItem.innerText = player;
    container.appendChild(cardPlayersListItem);
}
function populateTeam(container, team) {
    let cardDiv = document.createElement('div');
    cardDiv.classList.add('ui', 'inverted', 'card');
    container.appendChild(cardDiv);
    
    let cardContentDiv = document.createElement('div');
    cardContentDiv.classList.add('content');
    cardDiv.appendChild(cardContentDiv);
    
    //let cardHeaderDiv = document.createElement('div');
    //cardHeaderDiv.classList.add('header');
    
    let cardMetaDiv = document.createElement('div');
    cardMetaDiv.classList.add('meta');
    cardMetaDiv.innerText = team.time;
    cardContentDiv.appendChild(cardMetaDiv);
    
    let cardDescriptionDiv = document.createElement('div');
    cardDescriptionDiv.classList.add('description');
    cardContentDiv.appendChild(cardDescriptionDiv);
    
    let cardPlayersList = document.createElement('ul');
    cardDescriptionDiv.appendChild(cardPlayersList);
    
    team.players.forEach(function(player){
        populateTeamPlayer(cardPlayersList, player);
    });
}
function populateTeams(container, result) {
    let cardsDiv = document.createElement('div');
    cardsDiv.classList.add('ui', 'three', 'stackable', 'cards');
    container.appendChild(cardsDiv);
    
    result.teams.forEach(function(team) {
        populateTeam(cardsDiv, team);
    });
}
function populateQuestInfo(container, result) {
    let questInfoDiv = document.createElement('div');
    questInfoDiv.classList.add('ui', 'grid', 'stacking', 'three', 'column');
    container.appendChild(questInfoDiv);
    
    let questNameDiv = document.createElement('div');
    questNameDiv.classList.add('twelve', 'wide', 'column');
    questInfoDiv.appendChild(questNameDiv);
    
    let questNameH2 = document.createElement('h2');
    questNameH2.innerText = result.questName;
    questNameDiv.appendChild(questNameH2);
    
    let eventDurationDiv = document.createElement('div');
    eventDurationDiv.classList.add('two', 'wide', 'column');
    questInfoDiv.appendChild(eventDurationDiv);
    
    let eventDurationH3 = document.createElement('h3');
    eventDurationH3.innerText = result.eventDuration;
    eventDurationDiv.appendChild(eventDurationH3);
    
    let eventDateDiv = document.createElement('div');
    eventDateDiv.classList.add('two', 'wide', 'column');
    questInfoDiv.appendChild(eventDateDiv);
    
    let eventDateH4 = document.createElement('h4');
    eventDateH4.innerText = result.eventDate;
    eventDateDiv.appendChild(eventDateH4);
}

function populateResult(container, result, index) {
    if (index != 0) {
        let dividerDiv = document.createElement('div');
        dividerDiv.classList.add('ui', 'hidden', 'divider');
        container.appendChild(dividerDiv);
    }
    
    let segmentDiv = document.createElement('div');
    segmentDiv.classList.add('ui', 'inverted', 'segment');
    container.appendChild(segmentDiv);
    
    populateQuestInfo(segmentDiv, result);
    populateTeams(segmentDiv, result);
}

function populateResults() {
    let container = document.getElementById('teamz-result-container');
    teamzResultsData.forEach(function(result, index) {
        populateResult(container, result, index);
    });
}

populateResults();
